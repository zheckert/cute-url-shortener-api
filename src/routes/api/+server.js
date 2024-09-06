// Load environment variables
import { config } from 'dotenv';
config();

// Import uuid for generating unique IDs
import { v4 as uuidv4 } from 'uuid';
import { uuidToBase62 } from './utils/base62';
import { rateLimit } from './utils/rateLimiter';

// Dynamically populate baseURL based on environment
const isProd = process.env.APP_ENV === 'production';

export async function POST({ request }) {
  try {
    await rateLimit(request.ip);
    const data = await request.json();
    const original_url = data.original_url;

    if (!original_url) {
      throw new Error('Missing original_url in request body');
    }

    const newId = uuidv4();
    console.log("newID", newId);

    // Encode the UUID using base62
    const encodedId = uuidToBase62(newId);
    console.log("encodedID", encodedId);

    // Construct the shortened URL
    const baseURL = isProd ? 'https://your-production-url.com' : 'http://localhost:5173';
    const shortenedUrl = `${baseURL}/${encodedId}`;

    return new Response(JSON.stringify({
      message: `${original_url} is now ${shortenedUrl}`
    }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function GET() {
  // todo: remove later. Request parameter: shortened_url (the shortened URL to redirect to)
  // todo: remove later. Response: Redirect to the original URL
  try {
    // todo: come back to this!
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
