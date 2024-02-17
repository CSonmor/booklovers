import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies }) {
	cookies.delete('jwt', {
		path: '/'
	});
	return json({ message: 'success' }, { status: 200 });
}
