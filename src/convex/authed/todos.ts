import { v } from 'convex/values';
import type { Doc } from '../_generated/dataModel';
import { authedMutation, authedQuery } from './helpers';

export const ensureUser = authedMutation({
	args: {},
	handler: async (ctx) => {
		const now = Date.now();
		await ctx.db.patch(ctx.user._id, { updatedAt: now });
		return ctx.user;
	}
});

export const getTodos = authedQuery({
	args: {},
	handler: async (ctx) => {
		const todos = await ctx.db
			.query('todos')
			.withIndex('by_userId', (q) => q.eq('userId', ctx.user._id))
			.collect();

		return todos.sort((a: Doc<'todos'>, b: Doc<'todos'>) => b.createdAt - a.createdAt);
	}
});

export const getTodo = authedQuery({
	args: {
		todoId: v.id('todos')
	},
	handler: async (ctx, args) => {
		const todo = await ctx.db.get(args.todoId);
		if (!todo || todo.userId !== ctx.user._id) {
			return null;
		}

		return todo;
	}
});

export const createTodo = authedMutation({
	args: {
		title: v.string(),
		description: v.optional(v.string())
	},
	handler: async (ctx, args) => {
		const now = Date.now();

		return await ctx.db.insert('todos', {
			userId: ctx.user._id,
			title: args.title,
			description: args.description,
			completed: false,
			createdAt: now
		});
	}
});

export const updateTodo = authedMutation({
	args: {
		todoId: v.id('todos'),
		title: v.optional(v.string()),
		description: v.optional(v.string()),
		completed: v.optional(v.boolean())
	},
	handler: async (ctx, args) => {
		const todo = await ctx.db.get(args.todoId);
		if (!todo) throw new Error('Todo not found');
		if (todo.userId !== ctx.user._id) throw new Error('Forbidden');

		const now = Date.now();
		const patch: Record<string, unknown> = { updatedAt: now };

		if (args.title !== undefined) patch.title = args.title;
		if (args.description !== undefined) patch.description = args.description;
		if (args.completed !== undefined) patch.completed = args.completed;

		await ctx.db.patch(args.todoId, patch);
		return args.todoId;
	}
});

export const deleteTodo = authedMutation({
	args: {
		todoId: v.id('todos')
	},
	handler: async (ctx, args) => {
		const todo = await ctx.db.get(args.todoId);
		if (!todo) throw new Error('Todo not found');
		if (todo.userId !== ctx.user._id) throw new Error('Forbidden');

		await ctx.db.delete(args.todoId);
		return args.todoId;
	}
});
