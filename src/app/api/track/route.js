import { connectToDatabase } from "@/lib/mongodb";
import fs from "fs";
import path from "path";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    // Get query parameters
    const id = searchParams.get("id") || "unknown_id";
    const recipient = searchParams.get("rcpt") || "unknown_recipient";
    const campaign = searchParams.get("camp") || "default";
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";

    // Connect to MongoDB
    const { db } = await connectToDatabase();

    // Insert open log
    await db.collection("opens").insertOne({
      id,
      recipient,
      campaign,
      openedAt: new Date(),
      ip,
      userAgent: req.headers.get("user-agent") || "unknown",
    });

    // ✅ Read image from public folder
    const filePath = path.join(process.cwd(), "public", "track.png"); // change name if different
    const imgBuffer = fs.readFileSync(filePath);

    // Return actual promo image
    return new Response(imgBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg", // change to image/png if using png
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  } catch (error) {
    console.error("❌ /api/track error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
