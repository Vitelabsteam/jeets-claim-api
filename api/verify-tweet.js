const { db } = require("./firebase.js");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.ALLOW_ORIGIN || "https://jeets.ai");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const { wallet, url, nonce } = req.body || {};
    if (!wallet || !url || !nonce) return res.json({ ok: false });

    // Node 18+ has fetch built-in
    const resp = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    const html = await resp.text();
    if (!html.includes(nonce)) return res.json({ ok: false });

    await db.doc(`wallets/${wallet}`).set({ actions: { tweet_verified: true } }, { merge: true });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.json({ ok: false });
  }
};
