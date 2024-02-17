import { getLikedBooksForUser } from '$lib/firebase/database.server';

export async function load({ locals }) {
	const books = await getLikedBooksForUser(locals.user.id);

	return { books: books.books };
}
