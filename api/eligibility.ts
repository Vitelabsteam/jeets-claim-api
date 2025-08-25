import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "./firebase.js";

const allowOrigin = process.env.ALLOW_ORIGIN || "https://jeets.ai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", allowOrigin);
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const wallet = String(req.query.wallet || "").trim();
  if (!wallet) return res.json({ exists: false });

  const ref = db.doc(`wallets/${wallet}`);
  const snap = await ref.get();
  if (!snap.exists) return res.json({ exists: false });

  const d: any = snap.data() || {};
  let nonce: string = d.tweet_nonce;
  if (!nonce) {
    nonce = makeNonce(wallet);
    await ref.set({ tweet_nonce: nonce }, { merge: true });
  }

  res.json({
    exists: true,
    pending_jeets: d.pending_jeets || 0,
    tweet_nonce: nonce,
    actions: d.actions || {}
  });
}

function makeNonce(pk: string) {
  const short = pk.slice(0, 4) + "…" + pk.slice(-4);
  return `CLAIM-${short}-${(Math.random() * 1e6 | 0).toString(36).toUpperCase()}`;
}