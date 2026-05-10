import { adminQuery } from './helpers';
import type { Doc, Id } from '../_generated/dataModel';

export const getAllTodos = adminQuery({
	args: {},
	handler: async (ctx) => {
		const todos = await ctx.db.query('todos').collect();
		const users = await ctx.db.query('users').collect();
		const userMap = new Map<Id<'users'>, Doc<'users'>>(users.map((u: Doc<'users'>) => [u._id, u]));

		return todos
			.sort((a: Doc<'todos'>, b: Doc<'todos'>) => b.createdAt - a.createdAt)
			.map((todo: Doc<'todos'>) => {
				const user = userMap.get(todo.userId);
				return {
					...todo,
					userName: user?.name ?? 'Unknown',
					userEmail: user?.email ?? ''
				};
			});
	}
});

export const getAllUsers = adminQuery({
	args: {},
	handler: async (ctx) => {
		const users = await ctx.db.query('users').collect();
		const todos = await ctx.db.query('todos').collect();

		return users
			.sort((a: Doc<'users'>, b: Doc<'users'>) => a.createdAt - b.createdAt)
			.map((user: Doc<'users'>) => {
				const userTodos = todos.filter((t: Doc<'todos'>) => t.userId === user._id);
				return {
					...user,
					todoCount: userTodos.length,
					completedCount: userTodos.filter((t: Doc<'todos'>) => t.completed).length
				};
			});
	}
});
