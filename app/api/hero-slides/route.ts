import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import HeroSlide from "@/models/HeroSlide";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const activeOnly = req.nextUrl.searchParams.get("active") === "true";

    const query = activeOnly ? { active: true } : {};
    const slides = await HeroSlide.find(query).sort({ order: 1 }).lean();

    return NextResponse.json({ slides });
  } catch (err) {
    console.error("[hero-slides GET]", err);
    return NextResponse.json(
      { error: "Failed to fetch hero slides" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const required = [
      "brand",
      "name",
      "price",
      "productHandle",
      "image",
      "glow",
      "tagColor",
    ];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 },
        );
      }
    }

    if (body.order === undefined) {
      const last = await HeroSlide.findOne().sort({ order: -1 }).lean();
      body.order = last ? (last as any).order + 1 : 0;
    }

    const slide = await HeroSlide.create(body);
    return NextResponse.json({ slide }, { status: 201 });
  } catch (err) {
    console.error("[hero-slides POST]", err);
    return NextResponse.json(
      { error: "Failed to create hero slide" },
      { status: 500 },
    );
  }
}
