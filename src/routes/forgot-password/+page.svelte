<script>
	import AuthForm from '$lib/components/auth/AuthForm.svelte';
	import { mailResetPasswordEmail } from '$lib/firebase/auth.client';
	import messagesStore from '$lib/stores/messages.store';

	const showPassword = false;
	let showForm = true;

	async function sendEmail(e) {
		try {
			const formData = new FormData(e.target);
			const email = formData.get('email');
			if (!email) {
				messagesStore.showError('You need to enter an email');
				return;
			}
			await mailResetPasswordEmail(email);
			showForm = false;
			messagesStore.showSuccess('Email sent with password recovery instructions');
		} catch (err) {
			console.log(err.code);
			messagesStore.showError();
		}
	}
</script>

<div class="row">
	<div class="col">
		<h1>Forgot Password</h1>
	</div>
</div>

{#if showForm}
	<AuthForm btnName="Forgot Password" {showPassword} on:submit={sendEmail} />
{/if}

<svelte:head>
	<title>Book Lovers - Forgot Password</title>
</svelte:head>
