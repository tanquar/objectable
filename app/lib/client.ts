import { MongoClient } from "mongodb";

const MONGO_URL = Deno.env.get("MONGO_URL");
console.log("MONGO_URL:", MONGO_URL);
if (!MONGO_URL) {
  console.warn("MONGO_URL environment variable is not set.");
}

let client: MongoClient | null = null;

export async function getClient() {
  if (!MONGO_URL) {
    throw new Error("MONGO_URL environment variable is not set");
  }

  if (!client) {
    client = new MongoClient(MONGO_URL);
    await client.connect();
  }

  return client;
}
