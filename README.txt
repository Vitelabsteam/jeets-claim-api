# Jeets Claim API (Vercel)

Endpoints:
- GET /eligibility?wallet=PUBKEY
- POST /verify-tweet  { wallet, url, nonce }
- POST /submit-month  { wallet, month }

Environment variables (Vercel → Project → Settings → Environment Variables):
- FB_PROJECT_ID
- FB_CLIENT_EMAIL
- FB_PRIVATE_KEY   (use multiline, or replace newlines with \n)
- ALLOW_ORIGIN = https://jeets.ai