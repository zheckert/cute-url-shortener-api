import { MongoClient } from 'mongodb';
import { config } from 'dotenv';

config();

const uri = process.env.MONGODB_URI;
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
