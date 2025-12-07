import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
  offerId: { type: String, unique: true },
  title: String,
  bankName: String,
  minAmount: Number,
  maxAmount: Number,
  maxDiscount: Number,
  discountNow: Number,
  discountType: String,
  discountValue: Number,
  paymentInstruments: [String],
}, { timestamps: true });

export default mongoose.model("Offer", offerSchema);
