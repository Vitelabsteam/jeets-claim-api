import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "./firebase.js";
import fetch from "node-fetch";

const allowOrigin = process.env.ALLOW_ORIGIN || "https://jeets.ai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", allowOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const { wallet, url, nonce } = req.body || {};
    if (!wallet || !url || !nonce) return res.json({ ok: false });

    const html = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } }).then(r => r.text());
    const ok = html.includes(nonce);
    if (!ok) return res.json({ ok: false });

    await db.doc(`wallets/${wallet}`).set({ actions: { tweet_verified: true } }, { merge: true });
    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.json({ ok: false });
  }
}