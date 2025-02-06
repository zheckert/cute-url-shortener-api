import { MongoClient } from 'mongodb';
import 'dotenv/config';

console.log('Environment check:', {
	hasUri: !!process.env.MONGODB_URI,
	uriStart: process.env.MONGODB_URI?.substring(0, 20) + '...'
});

const uri = process.env.MONGODB_URI;
if (!uri) {
	throw new Error('MONGODB_URI environment variable is not set');
}

let client;
let db;

export const connectToDB = async () => {
	if (!client) {
		client = new MongoClient(uri);
		await client.connect();
		db = client.db('shortener');
	}
	return db;
};
