import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { amount, planId, planName } = await req.json();

    const keyId     = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret || keyId === "your_razorpay_key_id") {
      return NextResponse.json(
        { error: "Razorpay keys not configured. Add valid keys to .env.local" },
        { status: 500 }
      );
    }

    // ── Create real Razorpay order ───────────────────────────────────────────
    const amountInPaise = amount; // Already in paise from PLANS constant

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount:   amountInPaise,
        currency: "INR",
        receipt:  `trilingua_${Date.now()}`,
        notes: { planId, planName },
      }),
    });

    if (!rzpRes.ok) {
      const error = await rzpRes.json();
      console.error("[Razorpay] Order creation failed:", error);
      
      const desc = error?.error?.description || "Order creation failed";
      
      // Specific hint for auth errors
      if (desc.toLowerCase().includes("authentication")) {
        return NextResponse.json(
          { error: "Razorpay authentication failed — your API keys may be expired. Generate new keys at https://dashboard.razorpay.com/app/keys", details: error },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        { error: desc, details: error },
        { status: 500 }
      );
    }

    const order = await rzpRes.json();

    return NextResponse.json({
      orderId:  order.id,
      amount:   order.amount,
      currency: order.currency,
      keyId,
      planId,
      planName,
    });

  } catch (err) {
    console.error("[Razorpay] Route error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
