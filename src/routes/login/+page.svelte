<script>
	import { page } from '$app/stores';
	import AuthForm from '$lib/components/auth/AuthForm.svelte';
	import { loginWithEmailAndPassword } from '$lib/firebase/auth.client';
	import LoginWithGoogle from '$lib/components/auth/LoginWithGoogle.svelte';
	import messagesStore from '$lib/stores/messages.store';
	import { afterLogin } from '$lib/helpers/route.helper';

	async function login(e) {
		try {
			const formData = new FormData(e.target);
			const email = formData.get('email');
			const password = formData.get('password');
			if (!email || !password) {
				messagesStore.showError('You need to enter an email and a password');
				return;
			}
			const user = await loginWithEmailAndPassword(email, password);
			await afterLogin($page.url, user.uid);
		} catch (err) {
			if (err.code === 'auth/invalid-credential') {
				messagesStore.showError(
					'The credentials you entered do not match any currently registered accounts'
				);
				return;
			}
			console.log(err.code);
			messagesStore.showError();
		}
	}
</script>

<div class="row">
	<div class="col">
		<h1>Login</h1>
	</div>
</div>

<hr />
<AuthForm btnName="Login" on:submit={login} />
<hr />
<LoginWithGoogle />
<hr />
<div class="row">
	<div class="col">
		<a href="/forgot-password" class="btn btn-warning w-100">Forgot Password</a>
	</div>
</div>

<svelte:head>
	<title>Book Lovers - Login</title>
</svelte:head>
