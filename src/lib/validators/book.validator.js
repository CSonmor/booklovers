import yup from 'yup';

export default async function validate(formData, edit = false) {
	const schema = yup.object({
		title: yup.string().required('The book must have a title').min(4).max(40),
		author: yup.string().required('The book must have an author').min(5).max(200),
		short_description: yup.string('Briefly describe the book').required().min(5).max(200),
		description: yup
			.string()
			.required('Please describe the book, highlighting why you like it')
			.min(5)
			.max(4500),
		small_picture: yup
			.mixed()
			.nullable()
			.test('fileRequired', 'Small picture required', (value) => {
				return value !== null || value.size > 0 || edit;
			})
			.test('fileType', 'The file must be an image', (value) => {
				if (value && value.size > 0 && value.type) {
					return ['image/png', 'image/jpeg'].includes(value.type);
				}
				return true;
			})
			.test('fileSize', 'The file is too large', (value) => {
				if (value && value.size) {
					return value.size < 4_000_000;
				}
				return true;
			}),
		main_picture: yup
			.mixed()
			.nullable()
			.test('fileRequired', 'Main picture required', (value) => {
				return value !== null || value.size > 0 || edit;
			})
			.test('fileType', 'The file must be an image', (value) => {
				if (value && value.size > 0 && value.type) {
					return ['image/png', 'image/jpeg'].includes(value.type);
				}
				return true;
			})
			.test('fileSize', 'The file is too large', (value) => {
				if (value && value.size) {
					return value.size < 4_000_000;
				}
				return true;
			})
	});

	const data = {
		title: formData.get('title'),
		author: formData.get('author'),
		description: formData.get('description'),
		short_description: formData.get('short_description'),
		main_picture: formData.get('main_picture'),
		small_picture: formData.get('small_picture')
	};

	try {
		await schema.validate(data, { abortEarly: false });

		return { success: true, book: data };
	} catch (error) {
		const errors = error.inner.reduce((agg, err) => {
			if (!agg['error_' + err.path]) {
				agg['error_' + err.path] = err.message;
			}
			return agg;
		}, {});

		delete data.main_picture;
		delete data.small_picture;

		return { ...errors, ...data, success: false };
	}
}
