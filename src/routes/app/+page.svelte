<script lang="ts">
	import Plus from '@lucide/svelte/icons/plus';
	import Pencil from '@lucide/svelte/icons/pencil';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import Check from '@lucide/svelte/icons/check';
	import { useQuery, useConvexClient } from 'convex-svelte';
	import { api } from '../../convex/_generated/api';
	import type { Id } from '../../convex/_generated/dataModel';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import SkeletonList from '$lib/components/SkeletonList.svelte';
	import { getAuthContext } from '$lib/stores/auth.svelte';

	const authContext = getAuthContext();

	const todos = useQuery(api.authed.todos.getTodos, () => ({
		sessionToken: authContext.sessionToken ?? ''
	}));
	const client = useConvexClient();

	let showCreate = $state(false);
	let newTitle = $state('');
	let newDescription = $state('');
	let creating = $state(false);

	let editingId = $state<Id<'todos'> | null>(null);
	let editTitle = $state('');
	let editDescription = $state('');
	let saving = $state(false);

	async function handleCreate() {
		if (!newTitle.trim()) return;
		creating = true;
		try {
			await client.mutation(api.authed.todos.createTodo, {
				sessionToken: authContext.sessionToken ?? '',
				title: newTitle.trim(),
				description: newDescription.trim() || undefined
			});
			newTitle = '';
			newDescription = '';
			showCreate = false;
		} finally {
			creating = false;
		}
	}

	async function handleToggle(todoId: Id<'todos'>, current: boolean) {
		await client.mutation(api.authed.todos.updateTodo, {
			sessionToken: authContext.sessionToken ?? '',
			todoId,
			completed: !current
		});
	}

	async function handleDelete(todoId: Id<'todos'>) {
		await client.mutation(api.authed.todos.deleteTodo, {
			sessionToken: authContext.sessionToken ?? '',
			todoId
		});
	}

	function startEdit(todo: { _id: Id<'todos'>; title: string; description?: string | null }) {
		editingId = todo._id;
		editTitle = todo.title;
		editDescription = todo.description ?? '';
	}

	async function handleSaveEdit() {
		if (!editTitle.trim() || !editingId) return;
		saving = true;
		try {
			await client.mutation(api.authed.todos.updateTodo, {
				sessionToken: authContext.sessionToken ?? '',
				todoId: editingId,
				title: editTitle.trim(),
				description: editDescription.trim() || undefined
			});
			editingId = null;
			editTitle = '';
			editDescription = '';
		} finally {
			saving = false;
		}
	}

	function cancelEdit() {
		editingId = null;
		editTitle = '';
		editDescription = '';
	}
</script>

<div class="mx-auto max-w-3xl space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h2 class="text-2xl font-semibold">My Todos</h2>
			<p class="text-sm text-muted-foreground">Manage your tasks</p>
		</div>
		<Button onclick={() => (showCreate = true)} class="gap-2">
			<Plus class="size-4" />
			Add Todo
		</Button>
	</div>

	{#if !todos.data}
		<SkeletonList />
	{:else if todos.data.length === 0}
		<Card.Root class="border-dashed">
			<Card.Content class="flex flex-col items-center gap-3 py-12">
				<p class="text-sm text-muted-foreground">No todos yet. Create your first one!</p>
				<Button onclick={() => (showCreate = true)} variant="outline" class="gap-2">
					<Plus class="size-4" />
					Add Todo
				</Button>
			</Card.Content>
		</Card.Root>
	{:else}
		<div class="space-y-2">
			{#each todos.data as todo (todo._id)}
				{@const isEditing = editingId === todo._id}
				<div
					class="flex items-start gap-3 rounded-xl border p-4 transition-colors hover:bg-muted/50"
					class:opacity-60={todo.completed}
				>
					<button
						onclick={() => handleToggle(todo._id, todo.completed)}
						class="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border-2 hover:bg-primary/10"
						class:border-primary={todo.completed}
						class:bg-primary={todo.completed}
						class:text-primary-foreground={todo.completed}
						aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
					>
						{#if todo.completed}
							<Check class="size-3" />
						{/if}
					</button>

					<div class="min-w-0 flex-1">
						{#if isEditing}
							<div class="space-y-2">
								<Input bind:value={editTitle} placeholder="Todo title" />
								<Textarea
									bind:value={editDescription}
									placeholder="Description (optional)"
									rows={2}
								/>
								<div class="flex gap-2">
									<Button onclick={handleSaveEdit} size="sm" disabled={saving}>Save</Button>
									<Button onclick={cancelEdit} size="sm" variant="outline">Cancel</Button>
								</div>
							</div>
						{:else}
							<p
								class="text-sm font-medium"
								class:line-through={todo.completed}
								class:text-muted-foreground={todo.completed}
							>
								{todo.title}
							</p>
							{#if todo.description}
								<p class="mt-1 text-xs text-muted-foreground" class:line-through={todo.completed}>
									{todo.description}
								</p>
							{/if}
						{/if}
					</div>

					<div class="flex shrink-0 gap-1">
						<Button
							onclick={() => startEdit(todo)}
							variant="ghost"
							size="icon-sm"
							aria-label="Edit todo"
						>
							<Pencil class="size-3.5" />
						</Button>
						<Button
							onclick={() => handleDelete(todo._id)}
							variant="ghost"
							size="icon-sm"
							aria-label="Delete todo"
						>
							<Trash2 class="size-3.5 text-destructive" />
						</Button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<Dialog.Root open={showCreate} onOpenChange={(open) => (showCreate = open)}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>New Todo</Dialog.Title>
			<Dialog.Description>Create a new task to track.</Dialog.Description>
		</Dialog.Header>
		<div class="space-y-4 py-4">
			<div class="space-y-2">
				<Label>Title</Label>
				<Input bind:value={newTitle} placeholder="What needs to be done?" />
			</div>
			<div class="space-y-2">
				<Label>Description <span class="text-muted-foreground">(optional)</span></Label>
				<Textarea bind:value={newDescription} placeholder="Add details..." rows={3} />
			</div>
		</div>
		<Dialog.Footer>
			<Button onclick={() => (showCreate = false)} variant="outline">Cancel</Button>
			<Button onclick={handleCreate} disabled={creating || !newTitle.trim()}>
				{creating ? 'Creating...' : 'Create'}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
