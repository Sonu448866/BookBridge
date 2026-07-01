import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["book", "note", "question_paper", "giveaway"],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      default: "",
    },
    isbn: {
      type: String,
      default: "",
    },
    courseCode: {
      type: String,
      default: "",
      uppercase: true,
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    suggestedPrice: {
      type: Number,
      default: 0,
    },
    condition: {
      type: String,
      enum: ["new", "like_new", "good", "fair", "poor", ""],
      default: "",
    },
    images: [{ type: String }],
    documentUrl: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["available", "reserved", "sold", "donated"],
      default: "available",
    },
    meetupPoint: {
      name: { type: String, default: "" },
      lat: { type: Number },
      lng: { type: Number },
    },
    tags: [{ type: String }],
    views: { type: Number, default: 0 },
  },
  { timestamps: true },
);

itemSchema.index({
  title: "text",
  author: "text",
  courseCode: "text",
  description: "text",
});

export default mongoose.model("Item", itemSchema);
