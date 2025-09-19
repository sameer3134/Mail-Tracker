// lib/mongodb.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "email_tracking";
if (!uri) throw new Error("Please add MONGODB_URI to .env.local");

let cached = global._mongo || { conn: null, promise: null };
if (!cached) cached = global._mongo = { conn: null, promise: null };

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const client = new MongoClient(uri);
    cached.promise = client.connect().then((client) => {
      return {
        client,
        db: client.db(dbName),
      };
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
