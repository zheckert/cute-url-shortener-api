export async function POST({ request }) {
  // todo: remove later. Request body: original_url (the URL to be shortened)
  // todo: remove later. Response: shortened_url (the newly generated shortened URL)

  const data = await request.json();
  const original_url = data.original_url;

  // Generate a random 6-character string
  // todo: generate a UUID or something more unique.
  const randomString = Math.random().toString(36).substring(2, 8);

  // Construct the shortened URL 
  // todo: set up a variable to handle prod OR sandbox
  const shortenedUrl = `http://localhost:5173/${randomString}`;

  return new Response(JSON.stringify({
    message: `${original_url} is now ${shortenedUrl}`
  }), {
    status: 201,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function GET() {
  // todo: remove later. Request parameter: shortened_url (the shortened URL to redirect to)
  // todo: remove later. Response: Redirect to the original URL
  return new Response(JSON.stringify({ message: 'Request received!' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
