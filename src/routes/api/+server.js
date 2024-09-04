// Load environment variables
import { config } from 'dotenv';
config();

// Instantiate uuid for help constructing unique URLs
const { v4: uuidv4 } = await import('uuid');

// Dynamically populate baseURL based on environment
const isProd = process.env.APP_ENV === 'production';

export async function POST({ request }) {
  // todo: remove later. Request body: original_url (the URL to be shortened)
  // todo: remove later. Response: shortened_url (the newly generated shortened URL)

  try {
    const data = await request.json();
    const original_url = data.original_url;

    if (!original_url) {
      throw new Error('Missing original_url in request body');
    }

    const newId = uuidv4();

    // Construct the shortened URL
    const baseURL = isProd ? 'todo: populate with prod URL' : 'http://localhost:5173';
    const shortenedUrl = `${baseURL}/${newId}`;

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
