<script lang="ts">
	import AppSidebar from '$lib/components/AppSidebar.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar';

	const { children } = $props();
</script>

<Sidebar.Provider>
	<AppSidebar />

	<Sidebar.Inset>
		<header
			class="group-[[data-collapsible=icon]]:wrapper-collapsed flex h-13 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear"
		>
			<Sidebar.Trigger />
			<div class="flex-1">
				<h1 class="text-lg font-semibold">TODO App</h1>
			</div>
		</header>

		<main class="flex-1 p-6">
			{@render children()}
		</main>
	</Sidebar.Inset>
</Sidebar.Provider>
