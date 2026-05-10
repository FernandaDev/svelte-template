import { privateQuery } from './helpers';

export const getStats = privateQuery({
	args: {},
	handler: async (ctx) => {
		const [users, todos] = (await Promise.all([
			ctx.db.query('users').collect(),
			ctx.db.query('todos').collect()
		])) as [Array<Record<string, unknown>>, Array<{ completed: boolean }>];

		return {
			totalUsers: users.length,
			totalTodos: todos.length,
			completedTodos: todos.filter((t) => t.completed).length,
			pendingTodos: todos.filter((t) => !t.completed).length
		};
	}
});

export const ping = privateQuery({
	args: {},
	handler: async () => {
		return { ok: true, timestamp: Date.now() };
	}
});
