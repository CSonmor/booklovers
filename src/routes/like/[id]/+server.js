import { error, json } from '@sveltejs/kit';
import { getBook, toggleBookLike } from '$lib/firebase/database.server.js';

export async function GET({ params, locals }) {
	if (!locals.user) {
		throw error(403, { message: 'Access Denied' });
	}

	const book = await getBook(params.id);
	if (!book) {
		throw error(404, { message: 'Book not found' });
	}

	try {
		const newBook = await toggleBookLike(params.id, locals.user.id);
		return json({ ...newBook });
	} catch (err) {
		console.log(err);
		throw error(500, { message: 'Server Error' });
	}
}
