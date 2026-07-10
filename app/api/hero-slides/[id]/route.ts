import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import HeroSlide from "@/models/HeroSlide";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await req.json();

    const slide = await HeroSlide.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true },
    );

    if (!slide) {
      return NextResponse.json({ error: "Slide not found" }, { status: 404 });
    }

    return NextResponse.json({ slide });
  } catch (err) {
    console.error("[hero-slides PATCH]", err);
    return NextResponse.json(
      { error: "Failed to update hero slide" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const slide = await HeroSlide.findByIdAndDelete(id);
    if (!slide) {
      return NextResponse.json({ error: "Slide not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[hero-slides DELETE]", err);
    return NextResponse.json(
      { error: "Failed to delete hero slide" },
      { status: 500 },
    );
  }
}
