import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "./firebase.js";

const allowOrigin = process.env.ALLOW_ORIGIN || "https://jeets.ai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", allowOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { wallet, month } = req.body || {};
  if (!wallet || !month) return res.json({ ok: false, error: "missing params" });

  const ref = db.doc(`wallets/${wallet}`);
  try {
    await db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists) throw new Error("wallet not found");
      const d: any = snap.data() || {};
      if (!(d.actions && d.actions.tweet_verified)) throw new Error("tweet not verified");
      if (d.claimed_month === month) throw new Error("already submitted");
      tx.update(ref, { claimed_month: month });
    });
    return res.json({ ok: true });
  } catch (e: any) {
    console.error(e);
    return res.json({ ok: false, error: e.message || "error" });
  }
}