export async function GET() {
  return new Response(JSON.stringify({ message: 'Request received!' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
