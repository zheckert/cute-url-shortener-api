export async function POST({request}) {
  // * Request body: original_url (the URL to be shortened)
  // * Response: shortened_url (the newly generated shortened URL)

  const data = await request.json();
  const original_url = data.original_url;

  return new Response(JSON.stringify({ shortened_url: original_url }), {
    status: 201,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function GET() {
  // * Request parameter: shortened_url (the shortened URL to redirect to)
  // * Response: Redirect to the original URL
  return new Response(JSON.stringify({ message: 'Request received!' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
