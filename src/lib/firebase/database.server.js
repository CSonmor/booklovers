import { FieldPath, FieldValue, Timestamp } from 'firebase-admin/firestore';
import { db } from '$lib/firebase/firebase.server';
import { saveFileToBucket } from '$lib/firebase/firestorage.server';
import { PAGE_SIZE } from '$env/static/private';

export async function getUser(id) {
	const user = await db.collection('users').doc(id).get();
	return user?.data();
}
export async function getBook(id, userId = null) {
	const bookRef = await db.collection('books').doc(id).get();
	if (bookRef.exists) {
		const user = userId ? await getUser(userId) : null;
		const likedBook = user?.bookIds?.includes(id) || false;
		return {
			id: bookRef.id,
			...bookRef.data(),
			likedBook
		};
	}
}

export async function getBooks(userId, page = 1) {
	const user = userId ? await getUser(userId) : null;
	const booksQuery = await db.collection('books').count().get();
	const bookCount = booksQuery.data().count;
	const hasNext = bookCount > page * +PAGE_SIZE;
	const hasPrev = page > 1;

	const books = await db
		.collection('books')
		.limit(+PAGE_SIZE)
		.offset((page - 1) * +PAGE_SIZE)
		.orderBy('created_at', 'desc')
		.get();

	const likedBooks = books.docs.map((b) => {
		const likedBook = user?.bookIds?.includes(b.id) || false;
		return { ...b.data(), id: b.id, likedBook };
	});

	return {
		books: likedBooks,
		bookCount,
		hasNext,
		hasPrev
	};
}

export async function getBooksForUser(userId) {
	const user = userId ? await getUser(userId) : null;

	const books = await db
		.collection('books')
		.orderBy('created_at', 'desc')
		.where('user_id', '==', userId)
		.get();

	const myBooks = books.docs.map((b) => {
		const likedBook = user?.bookIds?.includes(b.id) || false;
		return { ...b.data(), id: b.id, likedBook };
	});

	return { books: myBooks };
}

export async function getLikedBooksForUser(userId) {
	const user = userId ? await getUser(userId) : null;
	const bookIds = user?.bookIds || [];
	if (bookIds.length === 0) {
		return { books: [] };
	}
	const books = await db.collection('books').where(FieldPath.documentId(), 'in', bookIds).get();

	const myBooks = books.docs.map((b) => {
		return { ...b.data(), id: b.id, likedBook: true };
	});

	return { books: myBooks };
}

export async function addBook(book, userId) {
	// save to firestore database without pictures
	const bookCollection = db.collection('books');
	const bookRef = await bookCollection.add({
		title: book.title,
		author: book.author,
		short_description: book.short_description,
		description: book.description,
		user_id: userId,
		created_at: Timestamp.now().seconds,
		likes: 0
	});

	// save the pictures
	const smallPictureUrl = await saveFileToBucket(
		book.small_picture,
		`${userId}/${bookRef.id}/small_picture`
	);
	const mainPictureUrl = await saveFileToBucket(
		book.main_picture,
		`${userId}/${bookRef.id}/main_picture`
	);

	// update the doc in firestore database with the picture urls
	await bookRef.update({
		main_picture: mainPictureUrl,
		small_picture: smallPictureUrl
	});

	// return book id
	return bookRef.id;
}

export async function editBook(id, form, userId) {
	const bookRef = await db.collection('books').doc(id);
	let mainPicture = form.main_picture || null;
	let smallPicture = form.small_picture || null;
	delete form.main_picture;
	delete form.small_picture;
	await bookRef.update(form);

	if (mainPicture) {
		const mainPictureUrl = await saveFileToBucket(
			mainPicture,
			`${userId}/${bookRef.id}/main_picture`
		);
		await bookRef.update({ main_picture: mainPictureUrl });
	}
	if (smallPicture) {
		const smallPictureUrl = await saveFileToBucket(
			smallPicture,
			`${userId}/${bookRef.id}/small_picture`
		);
		await bookRef.update({ small_picture: smallPictureUrl });
	}
}

export async function toggleBookLike(bookId, userId) {
	const bookDoc = db.collection('books').doc(bookId);
	const userDoc = db.collection('users').doc(userId);
	const user = await userDoc.get();
	const userData = user.data();

	// Unlike the book if it was previously liked
	if (userData.bookIds && userData.bookIds.includes(bookId)) {
		await userDoc.update({
			bookIds: FieldValue.arrayRemove(bookId)
		});
		await bookDoc.update({
			likes: FieldValue.increment(-1)
		});
	}
	// Like the book
	else {
		await userDoc.update({
			bookIds: FieldValue.arrayUnion(bookId)
		});
		await bookDoc.update({
			likes: FieldValue.increment(1)
		});
	}

	return await getBook(bookId, userId);
}
