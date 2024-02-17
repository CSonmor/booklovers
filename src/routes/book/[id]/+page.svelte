<script>
	import Like from '$lib/components/books/Like.svelte';

	export let data;
</script>

<div class="row mt-3">
	<div class="col">
		<h1>Title: {data.book.title}</h1>
	</div>
</div>
<div class="row">
	<div class="col">
		<h2>Author: {data.book.author}</h2>
	</div>
</div>
<div class="row">
	<div class="col">
		<img class="main-image" src={data.book.main_picture} alt={data.book.title} />
	</div>
</div>
<div class="row mt-3">
	<div class="col">
		<pre>{data.book.description}</pre>
	</div>
</div>

<div class="row">
	<div class="col">
		<Like book={data.book} textAlign="center" />
	</div>
</div>
<svelte:head>
	<title>Book Lovers - {data.book.title}</title>
</svelte:head>

<style>
	.main-image {
		max-height: 300px;
	}
	.row {
		text-align: center;
	}
</style>
