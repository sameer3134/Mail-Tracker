import { connectToDatabase } from "@/lib/mongodb";
import { promises as fs } from "fs";
import path from "path";

export async function GET(req) {
  try {
    const { searchParams, pathname } = new URL(req.url);

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

    // Serve actual image from /public/promo.png
    const filePath = path.join(process.cwd(), "public", "track.png");
    const fileBuffer = await fs.readFile(filePath);

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Length": fileBuffer.length.toString(),
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
