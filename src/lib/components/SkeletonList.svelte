<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';

	interface Props {
		count?: number;
		/** Classes applied to each skeleton item */
		class?: string;
	}

	const { count = 4, class: className = 'h-16 rounded-xl' }: Props = $props();
	const skeletonKeys = $derived(Array.from({ length: count }, (_, i) => i));
</script>

<div class="space-y-3">
	{#each skeletonKeys as n (n)}
		<Skeleton class={className} />
	{/each}
</div>
