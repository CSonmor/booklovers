<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import AuthForm from '$lib/components/auth/AuthForm.svelte';
	import LoginWithGoogle from '$lib/components/auth/LoginWithGoogle.svelte';
	import { registerWithEmailAndPassword } from '$lib/firebase/auth.client';
	import messagesStore from '$lib/stores/messages.store';
	import { afterLogin } from '$lib/helpers/route.helper';

	async function register(e) {
		try {
			const formData = new FormData(e.target);
			const email = formData.get('email');
			const password = formData.get('password');
			if (!email || !password) {
				messagesStore.showError('You need to enter an email and a password');
				return;
			}
			if (password.length < 6) {
				messagesStore.showError('Password must have at least 6 characters');
				return;
			}
			const user = await registerWithEmailAndPassword(email, password);
			await afterLogin($page.url, user.uid);
		} catch (err) {
			if (err.code === 'auth/email-already-in-use') {
				messagesStore.showError('You have already registered, please log in');
				await goto('/login');
				return;
			}
			console.log(err.code);
			messagesStore.showError();
		}
	}
</script>

<div class="row">
	<div class="col">
		<h1>Sign Up</h1>
	</div>
</div>

<hr />
<AuthForm btnName="Sign Up" on:submit={register} />
<hr />
<LoginWithGoogle />

<svelte:head>
	<title>Book Lovers - Sign Up</title>
</svelte:head>
