import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const { db } = await connectToDatabase();

    // Just check connection by listing collections
    const collections = await db.listCollections().toArray();

    return new Response(
      JSON.stringify({
        success: true,
        dbName: db.databaseName,
        collections: collections.map(c => c.name),
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
