import { createContext, onMount } from 'svelte';
import type { Doc } from '../../convex/_generated/dataModel';
import type { ConvexClient } from 'convex/browser';
import type { api as ApiType } from '../../convex/_generated/api';

type User = Doc<'users'>;
type Api = typeof ApiType;

class AuthStore {
	sessionToken = $state<string | null>(null);
	currentUser = $state<User | null>(null);
	isLoading = $state(true);
	error = $state<string | null>(null);

	private _client: ConvexClient | null = null;
	private _api: Api | null = null;

	constructor() {
		onMount(() => {
			const stored = this._loadStoredSession();
			if (stored) {
				this.sessionToken = stored;
			}
			this.isLoading = false;
		});
	}

	setClient(client: ConvexClient, api: Api) {
		this._client = client;
		this._api = api;

		if (this.sessionToken) {
			this._fetchCurrentUser();
		}
	}

	async signUp(email: string, password: string, name: string): Promise<void> {
		if (!this._client || !this._api) throw new Error('Client not initialized');
		this.error = null;
		this.isLoading = true;

		try {
			const result = (await this._client.mutation(this._api.auth.signUp, {
				email,
				password,
				name
			})) as { token: string; userId: string };

			this.sessionToken = result.token;
			this._storeSession(result.token);
			await this._fetchCurrentUser();
		} catch (e) {
			this.error = e instanceof Error ? e.message : 'Sign up failed';
			throw e;
		} finally {
			this.isLoading = false;
		}
	}

	async signIn(email: string, password: string): Promise<void> {
		if (!this._client || !this._api) throw new Error('Client not initialized');
		this.error = null;
		this.isLoading = true;

		try {
			const result = (await this._client.mutation(this._api.auth.signIn, {
				email,
				password
			})) as { token: string; userId: string };

			this.sessionToken = result.token;
			this._storeSession(result.token);
			await this._fetchCurrentUser();
		} catch (e) {
			this.error = e instanceof Error ? e.message : 'Sign in failed';
			throw e;
		} finally {
			this.isLoading = false;
		}
	}

	async signOut(): Promise<void> {
		if (!this._client || !this._api || !this.sessionToken) {
			this._clearSession();
			return;
		}

		try {
			await this._client.mutation(this._api.auth.signOut, {
				sessionToken: this.sessionToken
			});
		} catch {
			// ignore errors on sign out
		}

		this._clearSession();
	}

	getSessionToken(): string | null {
		return this.sessionToken;
	}

	private async _fetchCurrentUser() {
		if (!this._client || !this._api || !this.sessionToken) return;

		try {
			const result = (await this._client.mutation(this._api.authed.todos.ensureUser, {
				sessionToken: this.sessionToken
			})) as User;

			this.currentUser = result;
		} catch {
			this._clearSession();
		}
	}

	private _storeSession(token: string) {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('convex_session', token);
		}
	}

	private _loadStoredSession(): string | null {
		if (typeof localStorage !== 'undefined') {
			return localStorage.getItem('convex_session');
		}
		return null;
	}

	private _clearSession() {
		this.sessionToken = null;
		this.currentUser = null;
		if (typeof localStorage !== 'undefined') {
			localStorage.removeItem('convex_session');
		}
	}
}

const [internalGetAuthContext, setInternalGetAuthContext] = createContext<AuthStore>();

export function getAuthContext() {
	const authContext = internalGetAuthContext();
	if (!authContext) {
		throw new Error('Auth context not found');
	}
	return authContext;
}

export function setAuthContext() {
	const authContext = new AuthStore();
	setInternalGetAuthContext(authContext);
	return authContext;
}
