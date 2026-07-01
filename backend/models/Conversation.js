import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const conversationSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    item: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
    messages: [messageSchema],
    lastMessage: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.model("Conversation", conversationSchema);
