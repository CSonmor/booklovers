<script>
	import { onDestroy, onMount } from 'svelte';
	import 'bootstrap/dist/css/bootstrap.min.css';
	import Nav from '$lib/components/Nav.svelte';
	import '$lib/firebase/firebase.client';
	import { sendJWTToken } from '$lib/firebase/auth.client';
	import authStore from '$lib/stores/auth.store.js';
	import messagesStore from '$lib/stores/messages.store';
	import bookNotifyStore from '$lib/stores/book-notify.store.js';

	export let data;
	let isLoggedIn = data.isLoggedIn;
	$: isLoggedIn = $authStore.isActive ? $authStore.isLoggedIn : data.isLoggedIn;

	let timerId;
	async function sendServerToken() {
		try {
			await sendJWTToken();
		} catch (err) {
			clearInterval(timerId);
			messagesStore.showError();
			console.log(err);
		}
	}

	onMount(async () => {
		try {
			await sendServerToken();
			timerId = setInterval(
				async () => {
					await sendServerToken(); // refresh the token every 10 minutes
				},
				1000 * 10 * 60
			);
		} catch (err) {
			console.log(err);
			messagesStore.showError();
		}

		return () => {
			clearInterval(timerId);
		};
	});
	function clearMessage() {
		messagesStore.hide();
	}

	let notifyBook = null;
	const unsub = bookNotifyStore.subscribe((book) => {
		if (!$authStore.isLoggedIn) {
			notifyBook = book;
			return;
		}
		if ($authStore.userId !== book.user_id) {
			notifyBook = book;
			return;
		}
	});

	function closeNotify() {
		notifyBook = null;
	}

	onDestroy(() => {
		unsub();
	});
</script>

<Nav {isLoggedIn} />

<main class="container">
	{#if $messagesStore.show}
		<div class="row mt-3">
			<div class="col">
				<div
					class:alert-danger={$messagesStore.type === 'error'}
					class:alert-success={$messagesStore.type === 'success'}
					class="alert alert-dismissible"
					role="alert"
				>
					<strong>{$messagesStore.type === 'success' ? 'Success' : 'Error'}:</strong>
					<span>{$messagesStore.message}</span>
					<button type="button" class="btn-close" aria-label="Close" on:click={clearMessage} />
				</div>
			</div>
		</div>
	{/if}
	<slot />
	{#if notifyBook}
		<div
			class="toast show position-fixed top-0 end-0 m-3"
			role="alert"
			aria-live="assertive"
			aria-atomic="true"
		>
			<div class="toast-header">
				<strong class="me-auto">New Book</strong>
				<button
					type="button"
					class="btn-close"
					data-bs-dismiss="toast"
					aria-label="Close"
					on:click={closeNotify}
				/>
			</div>
			<div class="toast-body">
				Book <a href="/book/{notifyBook.id}">{notifyBook.title}</a> just created!!
			</div>
		</div>
	{/if}
</main>
