import mongoose, { Schema } from "mongoose";

const HeroSlideSchema = new Schema(
  {
    order: { type: Number, required: true }, // slide position
    brand: { type: String, required: true },
    name: { type: String, required: true },
    sub: { type: String, default: "" },
    price: { type: String, required: true }, // manual override, e.g. "₱7,990"
    tag: { type: String, default: "IN STOCK" },
    productHandle: { type: String, required: true }, // links to /products/[handle]
    image: { type: String, required: true }, // uploaded image URL
    glow: { type: String, required: true }, // "195,230,64" (rgb triplet)
    tagColor: { type: String, required: true }, // "#c3e640" (hex, for text/badge)
    features: [{ type: String }], // up to 3 strings
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.models.HeroSlide ||
  mongoose.model("HeroSlide", HeroSlideSchema);
