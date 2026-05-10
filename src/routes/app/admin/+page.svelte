<script lang="ts">
	import ListTodo from '@lucide/svelte/icons/list-todo';
	import CheckSquare from '@lucide/svelte/icons/check-square';
	import Clock from '@lucide/svelte/icons/clock';
	import { useQuery } from 'convex-svelte';
	import { api } from '../../../convex/_generated/api';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import SkeletonList from '$lib/components/SkeletonList.svelte';
	import { getAuthContext } from '$lib/stores/auth.svelte';

	const authContext = getAuthContext();

	const todos = useQuery(api.authed.todos.getTodos, () => ({
		sessionToken: authContext.sessionToken ?? ''
	}));
	const completedCount = todos.data?.filter((t: { completed: boolean }) => t.completed).length ?? 0;
	const pendingCount = todos.data ? todos.data.length - completedCount : 0;
</script>

<div class="mx-auto max-w-3xl space-y-6">
	<div>
		<h2 class="text-2xl font-semibold">Admin Dashboard</h2>
		<p class="text-sm text-muted-foreground">Overview of all todos</p>
	</div>

	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		<Card.Root>
			<Card.Header>
				<div class="flex items-center gap-2">
					<ListTodo class="size-4 text-primary" />
					<Card.Description>Total Todos</Card.Description>
				</div>
				<Card.Title class="text-3xl">
					{#if todos.data}
						{todos.data.length}
					{:else}
						<Skeleton class="h-9 w-16" />
					{/if}
				</Card.Title>
			</Card.Header>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<div class="flex items-center gap-2">
					<CheckSquare class="size-4 text-primary" />
					<Card.Description>Completed</Card.Description>
				</div>
				<Card.Title class="text-3xl">
					{#if todos.data}
						{completedCount}
					{:else}
						<Skeleton class="h-9 w-16" />
					{/if}
				</Card.Title>
			</Card.Header>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<div class="flex items-center gap-2">
					<Clock class="size-4 text-primary" />
					<Card.Description>Pending</Card.Description>
				</div>
				<Card.Title class="text-3xl">
					{#if todos.data}
						{pendingCount}
					{:else}
						<Skeleton class="h-9 w-16" />
					{/if}
				</Card.Title>
			</Card.Header>
		</Card.Root>
	</div>

	<Card.Root>
		<Card.Header>
			<Card.Title>All Todos</Card.Title>
			<Card.Description>Recent entries across all users</Card.Description>
		</Card.Header>
		<Card.Content>
			{#if !todos.data}
				<SkeletonList count={5} class="h-12 rounded-xl" />
			{:else if todos.data.length === 0}
				<p class="py-8 text-center text-sm text-muted-foreground">No todos yet.</p>
			{:else}
				<div class="space-y-2">
					{#each todos.data as todo (todo._id)}
						<div class="flex items-center gap-3 rounded-xl border p-3">
							<div
								class="flex size-5 shrink-0 items-center justify-center rounded border-2"
								class:border-primary={todo.completed}
								class:bg-primary={todo.completed}
							>
								{#if todo.completed}
									<CheckSquare class="size-3 text-primary-foreground" />
								{/if}
							</div>
							<div class="min-w-0 flex-1">
								<p
									class="text-sm font-medium"
									class:line-through={todo.completed}
									class:text-muted-foreground={todo.completed}
								>
									{todo.title}
								</p>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</Card.Content>
	</Card.Root>
</div>
