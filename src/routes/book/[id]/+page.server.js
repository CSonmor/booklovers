import { error } from '@sveltejs/kit';
import { getBook } from '$lib/firebase/database.server.js';

export async function load({ params, locals }) {
	const book = await getBook(params.id, locals?.user?.id);
	if (!book) {
		throw error(404, { message: 'Book not found' });
	}

	return { book };
}
