// app/api/admin/bento-photos/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import BentoPhoto from "@/lib/models/BentoPhoto";
import { getStagedUploadUrl } from "@/lib/shopify-admin";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const indexRaw = formData.get("index");

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 },
      );
    }

    const index = Number(indexRaw);
    if (isNaN(index) || index < 0 || index > 8) {
      return NextResponse.json(
        { success: false, error: "Invalid tile index" },
        { status: 400 },
      );
    }

    // ── Step 1: Ask Shopify for a staged upload URL ───────────────────────
    const staged = await getStagedUploadUrl(file.name, file.type, file.size);
    if (!staged.success || !staged.target) {
      return NextResponse.json(
        { success: false, error: staged.error ?? "Failed to get upload URL" },
        { status: 500 },
      );
    }

    const { url, parameters, resourceUrl } = staged.target;

    // ── Step 2: Upload the file to Shopify's CDN via multipart POST ───────
    const upload = new FormData();
    for (const { name, value } of parameters) {
      upload.append(name, value);
    }
    upload.append("file", file);

    const uploadRes = await fetch(url, { method: "POST", body: upload });
    if (!uploadRes.ok) {
      const text = await uploadRes.text();
      console.error("[bento upload] Shopify CDN error:", text);
      return NextResponse.json(
        { success: false, error: "CDN upload failed" },
        { status: 500 },
      );
    }

    // ── Step 3: Save the public CDN URL to MongoDB ────────────────────────
    await BentoPhoto.findOneAndUpdate(
      { index },
      { $set: { src: resourceUrl } },
      { upsert: true, new: true },
    );

    return NextResponse.json({ success: true, url: resourceUrl });
  } catch (err: any) {
    console.error("[POST /api/admin/bento-photos/upload]", err);
    return NextResponse.json(
      { success: false, error: err.message ?? "Upload failed" },
      { status: 500 },
    );
  }
}