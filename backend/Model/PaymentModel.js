import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        tx_ref: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            default: "NGN",
        },
        status: {
            type: String,
            enum: ["pending", "successful", "failed", "cancelled"],
            default: "pending",
        },
        flutterwave_transaction_id: {
            type: String,
        },
        meta: {
            type: mongoose.Schema.Types.Mixed,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
