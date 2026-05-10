import { v } from 'convex/values';
import { customMutation, customQuery } from 'convex-helpers/server/customFunctions';
import { mutation, query } from '../_generated/server';
import { findUserBySession } from './_shared';

export const authedQuery = customQuery(query, {
	args: { sessionToken: v.string() },
	input: async (ctx, { sessionToken }: { sessionToken: string }) => {
		const user = await findUserBySession(ctx, sessionToken);
		if (!user) {
			throw new Error('Unauthorized');
		}

		return { ctx: { ...ctx, user }, args: {} };
	}
});

export const authedMutation = customMutation(mutation, {
	args: { sessionToken: v.string() },
	input: async (ctx, { sessionToken }: { sessionToken: string }) => {
		const user = await findUserBySession(ctx, sessionToken);
		if (!user) {
			throw new Error('Unauthorized');
		}

		return { ctx: { ...ctx, user }, args: {} };
	}
});
