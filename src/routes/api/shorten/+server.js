import { v4 as uuidv4 } from 'uuid';
import { uuidToBase62 } from '$lib/utils/base62';
import { rateLimit } from '$lib/utils/rateLimiter';
import { connectToDB } from '$lib/utils/db';

const isProd = process.env.APP_ENV === 'production';

export async function POST({ request }) {
	try {
		await rateLimit(request.ip);

		const baseURL = isProd ? 'https://your-production-url.com' : 'http://localhost:5173';
		const data = await request.json();
		const original_url = data.original_url;

		if (!original_url) {
			throw new Error('Missing original_url in request body');
		}

		if (!original_url.startsWith('http')) {
			throw new Error('Invalid URL: must start with http or https');
		}

		if (original_url.length > 2048) {
			throw new Error('URL too long');
		}

		const db = await connectToDB();
		const urlsCollection = db.collection('urls');

		const existingUrl = await urlsCollection.findOne({ original_url });

		if (existingUrl) {
			const shortenedUrl = `${baseURL}/${existingUrl.shortened_id}`;
			return new Response(
				JSON.stringify({
					message: `${original_url} is already shortened to ${shortenedUrl}`
				}),
				{
					status: 200,
					headers: {
						'Content-Type': 'application/json'
					}
				}
			);
		}

		const newId = uuidv4();
		const encodedId = uuidToBase62(newId);

		await urlsCollection.insertOne({
			original_url,
			shortened_id: encodedId,
			createdAt: new Date()
		});

		return new Response(
			JSON.stringify({
				message: `${original_url} is now ${baseURL}/${encodedId}`
			}),
			{
				status: 201,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
	} catch (error) {
		console.error(error);

		if (error.message === 'Missing original_url in request body') {
			return new Response(JSON.stringify({ error: 'Please provide a URL to shorten' }), {
				status: 400,
				headers: {
					'Content-Type': 'application/json'
				}
			});
		} else if (error.message === 'Invalid URL: must start with http or https') {
			return new Response(JSON.stringify({ error: 'Invalid URL: must start with http or https' }), {
				status: 400,
				headers: {
					'Content-Type': 'application/json'
				}
			});
		} else if (error.message === 'URL too long') {
			return new Response(JSON.stringify({ error: 'URL too long, please shorten it' }), {
				status: 400,
				headers: {
					'Content-Type': 'application/json'
				}
			});
		} else {
			return new Response(JSON.stringify({ error: error.message }), {
				status: 500,
				headers: {
					'Content-Type': 'application/json'
				}
			});
		}
	}
}
