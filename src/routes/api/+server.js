// Load environment variables
import { config } from 'dotenv';
config();

// Import uuid for generating unique IDs
import { v4 as uuidv4 } from 'uuid';

// Base62 encoding characters
const base62Chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Function to encode a BigInt as a base62 string
function encodeBase62(number) {
  if (number === 0n) return '0';
  let encoded = '';
  while (number > 0n) {
    encoded = base62Chars[number % 62n] + encoded;
    number = number / 62n;
  }
  return encoded;
}

// Function to convert UUID to a base62 encoded string
function uuidToBase62(uuid) {
  // Remove hyphens from UUID and convert to a BigInt
  const hex = uuid.replace(/-/g, '');
  const bigInt = BigInt(`0x${hex}`);
  
  // Convert BigInt to base62
  return encodeBase62(bigInt);
}

// Dynamically populate baseURL based on environment
const isProd = process.env.APP_ENV === 'production';

export async function POST({ request }) {
  try {
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
