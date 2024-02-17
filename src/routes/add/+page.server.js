import { fail, redirect } from '@sveltejs/kit';
import validateBook from '$lib/validators/book.validator.js';
import { addBook } from '$lib/firebase/database.server.js';

export const actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		const data = await validateBook(formData);
		if (!data.success) {
			return fail(422, data);
		}
		const bookId = await addBook(data.book, locals.user.id);
		throw redirect(303, `/book/${bookId}`);
	}
};
