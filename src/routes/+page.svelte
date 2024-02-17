<script>
	import { goto } from '$app/navigation';
	import Book from '$lib/components/books/Book.svelte';
	import messagesStore from '$lib/stores/messages.store.js';

	export let data;

	async function movePrev() {
		try {
			await goto(`/?page=${+data.page - 1}`);
		} catch (error) {
			messagesStore.showError();
		}
	}

	async function moveNext() {
		try {
			await goto(`/?page=${+data.page + 1}`);
		} catch (error) {
			messagesStore.showError();
		}
	}
</script>

<div class="row">
	<div class="col">
		<h1>Latest Books</h1>
		<h4>Page: {data.page}</h4>
	</div>
</div>
{#each data.books as book (book.id)}
	<Book {book} />
{/each}

<div class="row mt-3">
	<div class="col">
		<button class="btn btn-info w-100" disabled={!data.hasPrev} on:click={movePrev}>Prev</button>
	</div>
	<div class="col">
		<button class="btn btn-info w-100" disabled={!data.hasNext} on:click={moveNext}>Next</button>
	</div>
</div>
