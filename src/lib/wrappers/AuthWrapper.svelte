<script lang="ts">
	import { getAuthContext } from '$lib/stores/auth.svelte';
	import SignIn from '$lib/components/SignIn.svelte';

	const { children } = $props();

	const authContext = getAuthContext();
</script>

{#if authContext.isLoading}
	<div class="flex min-h-screen items-center justify-center">
		<div class="text-sm text-muted-foreground">Loading...</div>
	</div>
{:else if !authContext.currentUser && !authContext.sessionToken}
	<SignIn />
{:else if !authContext.currentUser && authContext.sessionToken}
	<div class="flex min-h-screen items-center justify-center">
		<div class="text-sm text-muted-foreground">Verifying session...</div>
	</div>
{:else}
	{@render children()}
{/if}
