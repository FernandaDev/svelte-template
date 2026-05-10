<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import { getAuthContext } from '$lib/stores/auth.svelte';
	import { useConvexClient, useQuery } from 'convex-svelte';
	import { api } from '../../convex/_generated/api';

	const { children } = $props();

	const authContext = getAuthContext();
	const client = useConvexClient();

	const userQuery = useQuery(api.authed.todos.getTodos, () => ({
		sessionToken: authContext.sessionToken ?? ''
	}));

	let bootstrapping = $state(false);

	$effect(() => {
		const token = authContext.sessionToken;
		if (bootstrapping || userQuery.isLoading) return;
		if (!token) return;
		if (userQuery.data !== undefined) return;

		bootstrapping = true;

		void client
			.mutation(api.authed.todos.ensureUser, { sessionToken: token })
			.catch((error) => {
				console.error('Failed to initialize user', error);
			})
			.finally(() => {
				bootstrapping = false;
			});
	});

	let shouldBlock = $derived(
		userQuery.isLoading || (userQuery.data === undefined && bootstrapping)
	);
</script>

{#if shouldBlock}
	<div class="flex min-h-screen flex-col gap-6 p-8">
		<Skeleton class="h-12 w-64 rounded-xl" />
		<Skeleton class="h-80 rounded-3xl" />
	</div>
{:else}
	{@render children?.()}
{/if}
