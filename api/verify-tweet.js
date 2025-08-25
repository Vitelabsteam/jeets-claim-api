
const { db } = require("./firebase.js");
const fetch = require("node-fetch");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.ALLOW_ORIGIN || "https://jeets.ai");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const { wallet, url, nonce } = req.body || {};
    if (!wallet || !url || !nonce) return res.json({ ok: false });

    const html = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } }).then(r => r.text());
    if (!html.includes(nonce)) return res.json({ ok: false });

    await db.doc(`wallets/${wallet}`).set({ actions: { tweet_verified: true } }, { merge: true });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.json({ ok: false });
  }
};
