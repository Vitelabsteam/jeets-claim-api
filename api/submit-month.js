
const { db } = require("./firebase.js");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.ALLOW_ORIGIN || "https://jeets.ai");
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
      const d = snap.data() || {};
      if (!(d.actions && d.actions.tweet_verified)) throw new Error("tweet not verified");
      if (d.claimed_month === month) throw new Error("already submitted");
      tx.update(ref, { claimed_month: month });
    });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.json({ ok: false, error: e.message || "error" });
  }
};
