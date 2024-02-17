/** @type {import('./$types').LayoutServerLoad} */
export function load({ locals }) {
	return {
		isLoggedIn: locals.user !== null
	};
}
