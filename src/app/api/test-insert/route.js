import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const { db } = await connectToDatabase();

    const result = await db.collection("testCollection").insertOne({
      name: "Sameer",
      time: new Date(),
    });

    return new Response(
      JSON.stringify({
        success: true,
        insertedId: result.insertedId,
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
