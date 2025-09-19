import { connectToDatabase } from "@/lib/mongodb";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const key = req.headers.get("x-admin-key") || searchParams.get("key");

  if (key !== process.env.ADMIN_API_KEY) {
    return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 });
  }

  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const perPage = Math.min(200, parseInt(searchParams.get("perPage") || "50"));
  const skip = (page - 1) * perPage;

  const filter = {};
  if (searchParams.get("id")) filter.id = searchParams.get("id");
  if (searchParams.get("recipient")) filter.recipient = searchParams.get("recipient");
  if (searchParams.get("campaign")) filter.campaign = searchParams.get("campaign");

  const { db } = await connectToDatabase();
  const coll = db.collection("email_opens");

  const total = await coll.countDocuments(filter);
  const docs = await coll
    .find(filter)
    .sort({ openedAt: -1 })
    .skip(skip)
    .limit(perPage)
    .toArray();

  return new Response(JSON.stringify({ total, page, perPage, results: docs }), {
    headers: { "Content-Type": "application/json" },
  });
}
