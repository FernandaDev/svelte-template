<script lang="ts">
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import CheckSquare from '@lucide/svelte/icons/check-square';
	import ListTodo from '@lucide/svelte/icons/list-todo';
	import Zap from '@lucide/svelte/icons/zap';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	const highlights = [
		{
			title: 'Track Everything',
			description: 'Create, organize, and manage your tasks in one place.',
			icon: ListTodo
		},
		{
			title: 'Stay Productive',
			description: 'Mark items complete and focus on what matters most.',
			icon: CheckSquare
		},
		{
			title: 'Fast & Simple',
			description: 'Built with Svelte 5 and Convex for instant reactivity.',
			icon: Zap
		}
	];
</script>

<div class="flex min-h-screen flex-col">
	<div class="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-20">
		<div class="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
			<div class="space-y-6">
				<Label
					class="rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold tracking-[0.24em] text-primary uppercase"
				>
					TODO App
				</Label>
				<div class="max-w-3xl text-5xl leading-tight font-semibold tracking-tight text-foreground">
					Stay organized, get things done.
				</div>
				<div class="max-w-2xl text-base leading-7 text-muted-foreground">
					A simple, fast TODO app built with SvelteKit 5 and Convex. Start managing your tasks
					today.
				</div>
				<div class="flex flex-wrap gap-3">
					<Button href="/app" size="lg" class="gap-2">
						Get Started
						<ArrowRight class="size-4" />
					</Button>
				</div>
			</div>

			<div class="grid gap-4">
				{#each highlights as highlight (highlight.title)}
					<Card.Root class="border-border/70 bg-card/90 shadow-sm backdrop-blur">
						<Card.Header class="gap-3">
							<div
								class="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary"
							>
								<highlight.icon class="size-5" />
							</div>
							<Card.Title>{highlight.title}</Card.Title>
							<Card.Description>{highlight.description}</Card.Description>
						</Card.Header>
					</Card.Root>
				{/each}
			</div>
		</div>
	</div>
</div>
