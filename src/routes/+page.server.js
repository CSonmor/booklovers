import { getBooks } from '$lib/firebase/database.server';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, url }) {
	const page = url.searchParams.get('page') || 1;
	const { books, bookCount, hasNext, hasPrev } = await getBooks(locals?.user?.id, +page);
	return { books, page, bookCount, hasNext, hasPrev };
}
