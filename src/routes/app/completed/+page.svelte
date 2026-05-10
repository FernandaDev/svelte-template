<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import Pencil from '@lucide/svelte/icons/pencil';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import { useQuery, useConvexClient } from 'convex-svelte';
	import { api } from '../../../convex/_generated/api';
	import type { Id } from '../../../convex/_generated/dataModel';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import SkeletonList from '$lib/components/SkeletonList.svelte';
	import { getAuthContext } from '$lib/stores/auth.svelte';

	const authContext = getAuthContext();

	const todos = useQuery(api.authed.todos.getTodos, () => ({
		sessionToken: authContext.sessionToken ?? ''
	}));
	const client = useConvexClient();

	let editingId = $state<Id<'todos'> | null>(null);
	let editTitle = $state('');
	let editDescription = $state('');
	let saving = $state(false);

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

	let completed = $derived(todos.data?.filter((t: { completed: boolean }) => t.completed) ?? []);
</script>

<div class="mx-auto max-w-3xl space-y-6">
	<div>
		<h2 class="text-2xl font-semibold">Completed</h2>
		<p class="text-sm text-muted-foreground">Finished tasks</p>
	</div>

	{#if !todos.data}
		<SkeletonList />
	{:else if completed.length === 0}
		<Card.Root class="border-dashed">
			<Card.Content class="flex flex-col items-center gap-3 py-12">
				<p class="text-sm text-muted-foreground">No completed todos yet.</p>
			</Card.Content>
		</Card.Root>
	{:else}
		<div class="space-y-2">
			{#each completed as todo (todo._id)}
				{@const isEditing = editingId === todo._id}
				<div class="flex items-start gap-3 rounded-xl border p-4 opacity-60">
					<button
						onclick={() => handleToggle(todo._id, todo.completed)}
						class="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border-2 bg-primary text-primary-foreground hover:bg-primary/80"
						aria-label="Mark incomplete"
					>
						<Check class="size-3" />
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
							<p class="text-sm font-medium text-muted-foreground line-through">
								{todo.title}
							</p>
							{#if todo.description}
								<p class="mt-1 text-xs text-muted-foreground line-through">
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
