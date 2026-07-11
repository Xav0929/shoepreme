import mongoose, { Schema, models, model } from "mongoose";

export interface IBentoPhoto {
  _id: string;
  index: number;
  src: string | null;
  label: string;
  caption: string;
  createdAt: Date;
  updatedAt: Date;
}

const BentoPhotoSchema = new Schema<IBentoPhoto>(
  {
    index:   { type: Number, required: true, unique: true, min: 0, max: 8 },
    src:     { type: String, default: null },
    label:   { type: String, default: "" },
    caption: { type: String, default: "" },
  },
  { timestamps: true },
);

export default models.BentoPhoto ||
  model<IBentoPhoto>("BentoPhoto", BentoPhotoSchema);