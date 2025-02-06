import { connectToDB } from '../../../utils/db';

export async function GET({ params }) {
  try {
    const shortenedId = params.shortenedId;
    console.log('Shortened ID received:', shortenedId);

    const db = await connectToDB();
    console.log('Connected to database:', db.databaseName);

    const urlsCollection = db.collection('urls');

    // Find the document by matching the shortened ID first
    let document = await urlsCollection.findOne({ shortened_id: shortenedId });

    if (!document) {
      // If not found, try matching shortened_url
      document = await urlsCollection.findOne({ shortened_url: `http://localhost:5173/${shortenedId}` }); 
    }

    if (!document) {
      console.log('Document not found for shortened ID:', shortenedId);
      return new Response(JSON.stringify({ error: 'Shortened URL not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Redirect to the original URL
    return Response.redirect(document.original_url, 301);
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
