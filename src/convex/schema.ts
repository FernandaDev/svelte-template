import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

const userRole = v.union(v.literal('admin'), v.literal('collaborator'));

export default defineSchema({
	users: defineTable({
		email: v.string(),
		passwordHash: v.string(),
		name: v.string(),
		role: userRole,
		createdAt: v.number(),
		updatedAt: v.number()
	}).index('by_email', ['email']),

	sessions: defineTable({
		token: v.string(),
		userId: v.id('users'),
		createdAt: v.number()
	}).index('by_token', ['token']),

	todos: defineTable({
		userId: v.id('users'),
		title: v.string(),
		description: v.optional(v.string()),
		completed: v.boolean(),
		createdAt: v.number(),
		updatedAt: v.optional(v.number())
	}).index('by_userId', ['userId'])
});
