import mongoose from "mongoose";


export type RefreshToken=mongoose.InferSchemaType<typeof RefreshTokenSchema>

const RefreshTokenSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    revoked: { type: Boolean, default: false },
    tokenHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  }

);

export const RefreshTokenModel =mongoose.model(
  "RefreshToken",
  RefreshTokenSchema
);

