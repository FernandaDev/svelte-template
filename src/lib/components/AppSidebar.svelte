<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar';
	import CheckSquare from '@lucide/svelte/icons/check-square';
	import Shield from '@lucide/svelte/icons/shield';
	import ListTodo from '@lucide/svelte/icons/list-todo';
	import LogOut from '@lucide/svelte/icons/log-out';
	import { page } from '$app/stores';
	import { getAuthContext } from '$lib/stores/auth.svelte';
	import { useQuery } from 'convex-svelte';
	import { api } from '../../convex/_generated/api';

	const authContext = getAuthContext();
	useQuery(api.authed.todos.getTodos, { sessionToken: authContext.sessionToken ?? '' });

	const isAdmin = $derived(authContext.currentUser?.role === 'admin');

	const navItems = [
		{ title: 'Todos', url: '/app', icon: ListTodo },
		{ title: 'Completed', url: '/app/completed', icon: CheckSquare }
	] as const;

	const adminItems = [{ title: 'Admin', url: '/app/admin', icon: Shield }] as const;
</script>

<Sidebar.Root collapsible="icon">
	<Sidebar.Content>
		<Sidebar.Header class="flex h-13 border-b border-border px-4">
			<div class="flex items-center gap-2">
				<div class="flex h-8 w-8 items-center justify-center rounded-lg">
					<ListTodo class="h-5 w-5 text-primary" />
				</div>
				<div class="group-data-[collapsible=icon]:hidden">
					<h1 class="text-sm font-semibold">TODO App</h1>
					<p class="text-xs text-muted-foreground">Stay organized</p>
				</div>
			</div>
		</Sidebar.Header>

		<div class="flex-1 overflow-y-auto py-4">
			<nav class="flex w-full flex-col gap-1 px-2">
				<Sidebar.Menu class="flex w-full gap-1">
					{#each navItems as item (item.url)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton
								class="w-full justify-start hover:bg-primary hover:text-primary-foreground data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
								isActive={$page.url.pathname === item.url}
								aria-current={$page.url.pathname === item.url ? 'page' : undefined}
							>
								{#snippet child({ props })}
									<a href={item.url} {...props}>
										<item.icon class="h-4 w-4" />
										<span>{item.title}</span>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>

				{#if isAdmin}
					<Sidebar.Separator class="my-3" />

					<Sidebar.GroupLabel class="px-2 group-data-[collapsible=icon]:hidden">
						Admin
					</Sidebar.GroupLabel>

					<Sidebar.Menu class="w-full">
						{#each adminItems as item (item.url)}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton
									class="w-full justify-start hover:bg-primary hover:text-primary-foreground data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
									isActive={$page.url.pathname === item.url}
									aria-current={$page.url.pathname === item.url ? 'page' : undefined}
								>
									{#snippet child({ props })}
										<a href={item.url} {...props}>
											<item.icon class="h-4 w-4" />
											<span class="flex-1">{item.title}</span>
										</a>
									{/snippet}
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				{/if}
			</nav>
		</div>

		<Sidebar.Footer class="border-t border-border p-4">
			<div class="flex items-center gap-3">
				<div
					class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary"
				>
					{authContext.currentUser?.name?.charAt(0).toUpperCase() ?? '?'}
				</div>
				<div class="flex-1 overflow-hidden group-data-[collapsible=icon]:hidden">
					<p class="truncate text-sm font-medium">
						{authContext.currentUser?.name ?? 'User'}
					</p>
					<p class="truncate text-xs text-muted-foreground">
						{isAdmin ? 'Admin' : 'User'}
					</p>
				</div>
				<button
					class="shrink-0 rounded-md p-1.5 text-muted-foreground group-data-[collapsible=icon]:hidden hover:bg-muted hover:text-foreground"
					onclick={() => authContext.signOut()}
					aria-label="Sign out"
				>
					<LogOut class="h-4 w-4" />
				</button>
			</div>
		</Sidebar.Footer>
	</Sidebar.Content>
	<Sidebar.Rail />
</Sidebar.Root>
