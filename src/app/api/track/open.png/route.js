import { connectToDatabase } from "@/lib/mongodb";

const PIXEL_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wIAAgMB9CtH/wAAAABJRU5ErkJggg==",
  "base64"
);

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id") || "unknown_id";
    const recipient = searchParams.get("rcpt") || "unknown_recipient";
    const campaign = searchParams.get("camp") || "default";

    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      req.ip ||
      "unknown";

    const { db } = await connectToDatabase();

    await db.collection("opens").insertOne({
      id,
      recipient,
      campaign,
      openedAt: new Date(),
      ip,
      userAgent: req.headers.get("user-agent") || "unknown",
    });

    return new Response(PIXEL_PNG, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Length": PIXEL_PNG.length.toString(),
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  } catch (error) {
    console.error("❌ /api/track error:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
