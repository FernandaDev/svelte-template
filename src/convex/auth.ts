import { v } from 'convex/values';
import { mutation } from './_generated/server';
import { findUserByEmail } from './authed/_shared';

function bufferToHex(buffer: ArrayBuffer | Uint8Array): string {
	const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
	return Array.from(bytes)
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
}

function hexToBuffer(hex: string): Uint8Array {
	const bytes = new Uint8Array(hex.length / 2);
	for (let i = 0; i < hex.length; i += 2) {
		bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
	}
	return bytes;
}

async function hashPassword(
	password: string,
	salt?: string
): Promise<{ hash: string; salt: string }> {
	const encoder = new TextEncoder();
	const saltBytes = salt
		? hexToBuffer(salt)
		: new Uint8Array(crypto.getRandomValues(new Uint8Array(16)));
	const saltBuffer = saltBytes.buffer.slice(
		saltBytes.byteOffset,
		saltBytes.byteOffset + saltBytes.byteLength
	) as ArrayBuffer;

	const key = await crypto.subtle.importKey(
		'raw',
		encoder.encode(password),
		{ name: 'PBKDF2' },
		false,
		['deriveBits']
	);

	const derived = await crypto.subtle.deriveBits(
		{
			name: 'PBKDF2',
			salt: saltBuffer,
			iterations: 100000,
			hash: 'SHA-256'
		},
		key,
		256
	);

	return {
		hash: bufferToHex(derived),
		salt: bufferToHex(saltBytes)
	};
}

function generateToken(): string {
	return crypto.randomUUID();
}

export const signUp = mutation({
	args: {
		email: v.string(),
		password: v.string(),
		name: v.string()
	},
	handler: async (ctx, args) => {
		const existing = await findUserByEmail(ctx, args.email);
		if (existing) {
			throw new Error('A user with this email already exists');
		}

		if (args.password.length < 8) {
			throw new Error('Password must be at least 8 characters');
		}

		const { hash, salt } = await hashPassword(args.password);
		const now = Date.now();

		const userId = await ctx.db.insert('users', {
			email: args.email,
			passwordHash: `${salt}:${hash}`,
			name: args.name,
			role: 'collaborator',
			createdAt: now,
			updatedAt: now
		});

		const token = generateToken();

		await ctx.db.insert('sessions', {
			token,
			userId,
			createdAt: now
		});

		return { token, userId };
	}
});

export const signIn = mutation({
	args: {
		email: v.string(),
		password: v.string()
	},
	handler: async (ctx, args) => {
		const user = await findUserByEmail(ctx, args.email);
		if (!user) {
			throw new Error('Invalid email or password');
		}

		const [salt, storedHash] = user.passwordHash.split(':');
		const { hash } = await hashPassword(args.password, salt);

		if (hash !== storedHash) {
			throw new Error('Invalid email or password');
		}

		const now = Date.now();

		await ctx.db.patch(user._id, { updatedAt: now });

		const token = generateToken();

		await ctx.db.insert('sessions', {
			token,
			userId: user._id,
			createdAt: now
		});

		return { token, userId: user._id };
	}
});

export const signOut = mutation({
	args: {
		sessionToken: v.string()
	},
	handler: async (ctx, args) => {
		const session = await ctx.db
			.query('sessions')
			.withIndex('by_token', (q) => q.eq('token', args.sessionToken))
			.first();

		if (session) {
			await ctx.db.delete(session._id);
		}
	}
});
