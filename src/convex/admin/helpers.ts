import { v } from 'convex/values';
import { customMutation, customQuery } from 'convex-helpers/server/customFunctions';
import { findUserBySession } from '../authed/_shared';
import { mutation, query } from '../_generated/server';

export const adminQuery = customQuery(query, {
	args: { sessionToken: v.string() },
	input: async (ctx, { sessionToken }: { sessionToken: string }) => {
		const user = await findUserBySession(ctx, sessionToken);
		if (!user || user.role !== 'admin') {
			throw new Error('Admin access required');
		}

		return { ctx: { ...ctx, admin: user }, args: {} };
	}
});

export const adminMutation = customMutation(mutation, {
	args: { sessionToken: v.string() },
	input: async (ctx, { sessionToken }: { sessionToken: string }) => {
		const user = await findUserBySession(ctx, sessionToken);
		if (!user || user.role !== 'admin') {
			throw new Error('Admin access required');
		}

		return { ctx: { ...ctx, admin: user }, args: {} };
	}
});
