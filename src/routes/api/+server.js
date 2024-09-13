// Load environment variables
import { config } from 'dotenv';
config();

// Import utilities
import { v4 as uuidv4 } from 'uuid';
import { uuidToBase62 } from './utils/base62';
import { rateLimit } from './utils/rateLimiter';
import { connectToDB } from './utils/db';

// Dynamically populate baseURL based on environment
const isProd = process.env.APP_ENV === 'production';

export async function POST({ request }) {
  try {
    await rateLimit(request.ip);

    const data = await request.json();
    const original_url = data.original_url;

    // Validate input before shortening
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

    // Make sure URL hasn't already been provided and shortened
    const existingUrl = await urlsCollection.findOne({ original_url });
    if (existingUrl) {
      return new Response(JSON.stringify({
        message: `${original_url} is already shortened to ${existingUrl.shortened_url}`
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const newId = uuidv4();
    // Encode the UUID using base62
    const encodedId = uuidToBase62(newId);

    // Construct the shortened URL
    const baseURL = isProd ? 'https://your-production-url.com' : 'http://localhost:5173';
    const shortenedUrl = `${baseURL}/${encodedId}`;

    // Store original URL and shortened equivalent in MongoDB
    await urlsCollection.insertOne({
      original_url,
      shortened_url: shortenedUrl,
      createdAt: new Date(),
    });

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

    // Return a descriptive error message to the user
    if (error.message === 'Missing original_url in request body') {
      return new Response(JSON.stringify({ error: 'Please provide a URL to shorten' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else if (error.message === 'Invalid URL: must start with http or https') {
      return new Response(JSON.stringify({ error: 'Invalid URL: must start with http or https' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else if (error.message === 'URL too long') {
      return new Response(JSON.stringify({ error: 'URL too long, please shorten it' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  }
}

export async function GET() {
  // todo: remove later. Request parameter: shortened_url (the shortened URL to redirect to)
  // todo: remove later. Response: Redirect to the original URL
  // todo: implement rate limiting on this request
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
