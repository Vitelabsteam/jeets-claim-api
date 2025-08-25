
const { db } = require("./firebase.js");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.ALLOW_ORIGIN || "https://jeets.ai");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const wallet = String(req.query.wallet || "").trim();
  if (!wallet) return res.json({ exists: false });

  const ref = db.doc(`wallets/${wallet}`);
  const snap = await ref.get();
  if (!snap.exists) return res.json({ exists: false });

  const d = snap.data() || {};
  let nonce = d.tweet_nonce;
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
};

function makeNonce(pk) {
  const short = pk.slice(0,4) + "…" + pk.slice(-4);
  return `CLAIM-${short}-${(Math.random()*1e6|0).toString(36).toUpperCase()}`;
}
