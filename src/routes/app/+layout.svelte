<script lang="ts">
	import AuthenticatedLayout from '$lib/components/AuthenticatedLayout.svelte';
	import EnsureUser from '$lib/components/EnsureUser.svelte';
	import AuthWrapper from '$lib/wrappers/AuthWrapper.svelte';
	import ConvexWrapper from '$lib/wrappers/ConvexWrapper.svelte';

	const { children } = $props();
</script>

<svelte:head>
	<title>TODO App</title>
</svelte:head>

<ConvexWrapper>
	<AuthWrapper>
		<EnsureUser>
			<AuthenticatedLayout>
				{@render children()}
			</AuthenticatedLayout>
		</EnsureUser>
	</AuthWrapper>
</ConvexWrapper>
