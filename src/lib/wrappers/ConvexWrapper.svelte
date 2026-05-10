<script lang="ts">
	import { CONVEX_URL } from '$lib/convex-env';
	import { setAuthContext } from '$lib/stores/auth.svelte';
	import { setupConvex, useConvexClient } from 'convex-svelte';
	import { api } from '../../convex/_generated/api';

	const authContext = setAuthContext();

	setupConvex(CONVEX_URL);

	const convex = useConvexClient();

	$effect(() => {
		authContext.setClient(convex, api);
	});

	const { children } = $props();
</script>

{@render children()}
