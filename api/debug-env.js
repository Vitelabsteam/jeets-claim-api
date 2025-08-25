module.exports = (req, res) => {
  const mask = (s) => (s ? s.slice(0, 3) + "…" + s.slice(-3) : null);
  res.json({
    env: process.env.VERCEL_ENV,        // "production" or "preview"
    hasProjectId: !!process.env.FB_PROJECT_ID,
    projectId: process.env.FB_PROJECT_ID || null,
    hasClientEmail: !!process.env.FB_CLIENT_EMAIL,
    clientEmailStart: mask(process.env.FB_CLIENT_EMAIL || ""),
    hasPrivateKey: !!process.env.FB_PRIVATE_KEY,
    privateKeyLen: process.env.FB_PRIVATE_KEY ? process.env.FB_PRIVATE_KEY.length : 0
  });
};
