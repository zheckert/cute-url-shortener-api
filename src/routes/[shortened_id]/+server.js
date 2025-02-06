import { connectToDB } from '$lib/utils/db';

export async function GET({ params }) {
	try {
		const shortenedId = params.shortened_id;
		console.log('Shortened ID received:', shortenedId);

		const db = await connectToDB();
		const urlsCollection = db.collection('urls');

		const document = await urlsCollection.findOne({ shortened_id: shortenedId });
		console.log('Found document:', document);

		if (!document) {
			console.log('Document not found for shortened ID:', shortenedId);
			return new Response(JSON.stringify({ error: 'Shortened URL not found' }), {
				status: 404,
				headers: {
					'Content-Type': 'application/json'
				}
			});
		}

		// Redirect to the original URL
		return Response.redirect(document.original_url, 301);
	} catch (error) {
		console.error(error);
		return new Response(JSON.stringify({ error: error.message }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
}
