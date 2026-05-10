<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { getAuthContext } from '$lib/stores/auth.svelte';

	const authContext = getAuthContext();

	let mode = $state<'signIn' | 'signUp'>('signIn');
	let email = $state('');
	let password = $state('');
	let name = $state('');
	let submitting = $state(false);
	let error = $state<string | null>(null);

	async function handleSubmit(e: Event) {
		e.preventDefault();
		error = null;
		submitting = true;

		try {
			if (mode === 'signIn') {
				await authContext.signIn(email, password);
			} else {
				await authContext.signUp(email, password, name || email.split('@')[0]);
			}
		} catch (e) {
			error = e instanceof Error ? e.message : 'Something went wrong';
		} finally {
			submitting = false;
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-muted/30 px-4">
	<Card.Root class="w-full max-w-md">
		<Card.Header class="text-center">
			<Card.Title>{mode === 'signIn' ? 'Sign In' : 'Create Account'}</Card.Title>
			<Card.Description>
				{mode === 'signIn'
					? 'Welcome back! Sign in to your account.'
					: 'Create a new account to get started.'}
			</Card.Description>
		</Card.Header>

		<Card.Content>
			<form onsubmit={handleSubmit} class="flex flex-col gap-4">
				{#if mode === 'signUp'}
					<div class="flex flex-col gap-2">
						<Label for="name">Name</Label>
						<Input id="name" type="text" bind:value={name} placeholder="Your name" required />
					</div>
				{/if}

				<div class="flex flex-col gap-2">
					<Label for="email">Email</Label>
					<Input
						id="email"
						type="email"
						bind:value={email}
						placeholder="you@example.com"
						required
					/>
				</div>

				<div class="flex flex-col gap-2">
					<Label for="password">Password</Label>
					<Input
						id="password"
						type="password"
						bind:value={password}
						placeholder="Min 8 characters"
						required
						minlength={8}
					/>
				</div>

				{#if error}
					<div class="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
						{error}
					</div>
				{/if}

				<Button type="submit" disabled={submitting} class="w-full">
					{submitting ? 'Please wait...' : mode === 'signIn' ? 'Sign In' : 'Create Account'}
				</Button>
			</form>
		</Card.Content>

		<Card.Footer class="justify-center">
			<button
				type="button"
				class="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground"
				onclick={() => {
					mode = mode === 'signIn' ? 'signUp' : 'signIn';
					error = null;
				}}
			>
				{mode === 'signIn' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
			</button>
		</Card.Footer>
	</Card.Root>
</div>
