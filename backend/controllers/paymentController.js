import Payment from "../Model/PaymentModel.js";

const FLW_API = "https://api.flutterwave.com/v3";

async function flwFetch(path, options = {}) {
    const secret = process.env.FLUTTERWAVE_SECRET_KEY;
    if (!secret) {
        throw new Error("FLUTTERWAVE_SECRET_KEY is not configured");
    }
    const res = await fetch(`${FLW_API}${path}`, {
        ...options,
        headers: {
            Authorization: `Bearer ${secret}`,
            "Content-Type": "application/json",
            ...options.headers,
        },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        const err = new Error(data.message || "Flutterwave request failed");
        err.status = res.status;
        err.data = data;
        throw err;
    }
    return data;
}

export const getPublicConfig = (req, res) => {
    const key = process.env.FLUTTERWAVE_PUBLIC_KEY;
    if (!key) {
        return res.status(503).json({ message: "Payments are not configured" });
    }
    res.json({ publicKey: key });
};

export const initializePayment = async (req, res, next) => {
    try {
        const amount = Number(req.body.amount);
        const currency = (req.body.currency || "NGN").toUpperCase();
        const meta = req.body.meta;

        if (!amount || amount <= 0 || Number.isNaN(amount)) {
            return res.status(400).json({ message: "Valid amount is required" });
        }

        const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:3000").replace(/\/$/, "");
        const tx_ref = `tx_${req.user._id}_${Date.now()}`;

        const paymentDoc = await Payment.create({
            user: req.user._id,
            tx_ref,
            amount,
            currency,
            status: "pending",
            meta: meta || {},
        });

        const payload = {
            tx_ref,
            amount: String(amount),
            currency,
            redirect_url: `${frontendUrl}/payment/callback`,
            customer: {
                email: req.user.email,
                name: req.user.username,
            },
            customizations: {
                title: process.env.APP_NAME || "Automind",
            },
            meta: {
                payment_id: String(paymentDoc._id),
                user_id: String(req.user._id),
                ...(meta && typeof meta === "object" ? meta : {}),
            },
        };

        const data = await flwFetch("/payments", {
            method: "POST",
            body: JSON.stringify(payload),
        });

        const link = data.data?.link;
        if (!link) {
            await Payment.findByIdAndUpdate(paymentDoc._id, { status: "failed" });
            return res.status(502).json({
                message: "Could not start payment",
                details: data,
            });
        }

        res.status(201).json({
            message: "Payment initialized",
            link,
            tx_ref,
            paymentId: paymentDoc._id,
        });
    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({
                message: error.message,
                details: error.data,
            });
        }
        next(error);
    }
};

export const verifyPayment = async (req, res, next) => {
    try {
        const transaction_id = req.query.transaction_id || req.params.transactionId;
        if (!transaction_id) {
            return res.status(400).json({ message: "transaction_id is required" });
        }

        const data = await flwFetch(`/transactions/${transaction_id}/verify`, { method: "GET" });
        const tx = data.data;
        if (!tx) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        const tx_ref = tx.tx_ref;
        const payment = await Payment.findOne({ tx_ref });
        if (!payment) {
            return res.status(404).json({ message: "No matching payment record" });
        }

        if (String(payment.user) !== String(req.user._id)) {
            return res.status(403).json({ message: "Not allowed to verify this payment" });
        }

        const status = tx.status === "successful" ? "successful" : "failed";
        payment.status = status;
        payment.flutterwave_transaction_id = String(tx.id);
        await payment.save();

        res.json({
            message: status === "successful" ? "Payment verified" : "Payment not successful",
            status: payment.status,
            amount: tx.amount,
            currency: tx.currency,
            tx_ref,
        });
    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({
                message: error.message,
                details: error.data,
            });
        }
        next(error);
    }
};

export const flutterwaveWebhook = async (req, res) => {
    try {
        const secretHash = process.env.FLUTTERWAVE_SECRET_HASH;
        const signature = req.headers["verif-hash"];
        if (!secretHash || signature !== secretHash) {
            return res.status(401).send("invalid signature");
        }

        const event = req.body;
        const data = event?.data;
        if (!data?.tx_ref) {
            return res.status(200).send("ignored");
        }

        const payment = await Payment.findOne({ tx_ref: data.tx_ref });
        if (!payment) {
            return res.status(200).send("ok");
        }

        if (data.status === "successful") {
            payment.status = "successful";
            payment.flutterwave_transaction_id = String(data.id);
        } else {
            payment.status = "failed";
        }
        await payment.save();
        return res.status(200).send("ok");
    } catch {
        return res.status(500).send("error");
    }
};
