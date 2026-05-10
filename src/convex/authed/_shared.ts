import type { Doc } from '../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../_generated/server';

export type AuthedQueryCtx = QueryCtx & { user: Doc<'users'> };
export type AuthedMutationCtx = MutationCtx & { user: Doc<'users'> };

export async function findUserBySession(ctx: MutationCtx | QueryCtx, token: string) {
	const session = await ctx.db
		.query('sessions')
		.withIndex('by_token', (query) => query.eq('token', token))
		.first();

	if (!session) return null;

	return await ctx.db.get(session.userId);
}

export async function findUserByEmail(ctx: MutationCtx | QueryCtx, email: string) {
	return await ctx.db
		.query('users')
		.withIndex('by_email', (query) => query.eq('email', email))
		.first();
}
