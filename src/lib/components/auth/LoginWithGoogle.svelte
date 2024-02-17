<script>
	import { page } from '$app/stores';
	import { loginWithGoogle } from '$lib/firebase/auth.client';
	import { afterLogin } from '$lib/helpers/route.helper';
	import messagesStore from '$lib/stores/messages.store';

	async function loginUsingGoogle() {
		try {
			const user = await loginWithGoogle();
			await afterLogin($page.url, user.uid);
		} catch (e) {
			if (e.code === 'auth/popup-closed-by-user') {
				return;
			}
			console.log(e);
			messagesStore.showError();
		}
	}
</script>

<div class="row">
	<div class="col">
		<button on:click={loginUsingGoogle} class="btn btn-primary w-100">Login with Google</button>
	</div>
</div>
