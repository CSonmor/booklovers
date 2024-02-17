import { getBooksForUser } from '$lib/firebase/database.server';

export async function load({ locals }) {
	console.log('getting books for local user ', locals.user.id);
	const books = await getBooksForUser(locals.user.id);

	return { books: books.books };
}
