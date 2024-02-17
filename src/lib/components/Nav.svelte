<!---
Create a variable named isLoggedIn that will be set to true or false.  Then use it to create an if statement in the Svelte template that shows logged navigation if isLoggedIn is true or non-logged-in navigation if isLoggedIn is false.
-->
<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { logout } from '$lib/firebase/auth.client';
	import messagesStore from '$lib/stores/messages.store';

	export let isLoggedIn;

	let showMobile = false;

	function toggleShowMobile() {
		showMobile = !showMobile;
	}

	async function signout() {
		try {
			await logout();
			goto('/');
		} catch (e) {
			console.log(e);
			messagesStore.showError();
		}
	}
</script>

<nav class="navbar navbar-expand-lg bg-body-tertiary">
	<div class="container-fluid">
		<a class="navbar-brand" href="/">Book Lover</a>
		<button
			on:click={toggleShowMobile}
			class="navbar-toggler"
			type="button"
			data-bs-toggle="collapse"
			data-bs-target="#navbarNav"
			aria-controls="navbarNav"
			aria-expanded="false"
			aria-label="Toggle navigation"
		>
			<span class="navbar-toggler-icon" />
		</button>
		<div class:show={showMobile} class="collapse navbar-collapse" id="navbarNav">
			<ul class="navbar-nav">
				{#if isLoggedIn}
					<li class="nav-item">
						<a
							class:active={$page.url.pathname === '/'}
							class="nav-link"
							aria-current="page"
							href="/">Home</a
						>
					</li>
					<li class="nav-item">
						<a class:active={$page.url.pathname === '/add'} class="nav-link" href="/add">Add Book</a
						>
					</li>
					<li class="nav-item">
						<a class:active={$page.url.pathname === '/profile'} class="nav-link" href="/profile"
							>Profile</a
						>
					</li>
					<li class="nav-item">
						<a class:active={$page.url.pathname === '/about'} class="nav-link" href="/about"
							>About</a
						>
					</li>
					<li class="nav-item">
						<span on:click={signout} class="nav-link">Logout</span>
					</li>
				{:else}
					<li class="nav-item">
						<a
							class:active={$page.url.pathname === '/'}
							class="nav-link"
							aria-current="page"
							href="/">Home</a
						>
					</li>
					<li class="nav-item">
						<a class:active={$page.url.pathname === '/about'} class="nav-link" href="/about"
							>About</a
						>
					</li>

					<li class="nav-item">
						<a class:active={$page.url.pathname === '/login'} class="nav-link" href="/login"
							>Login</a
						>
					</li>
					<li class="nav-item">
						<a class:active={$page.url.pathname === '/signup'} class="nav-link" href="/signup"
							>Sign Up</a
						>
					</li>
				{/if}
			</ul>
		</div>
	</div>
</nav>

<style>
	span.nav-link {
		cursor: pointer;
	}
</style>
