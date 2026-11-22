# Epic Gift — Complete Telegram Mini App Package (With Real Database)

## Configured Credentials
- **BOT_TOKEN**: `5078034194:AAGCfu2i-eWZvjcQ-1P2pjlPCuaryTo8nro`
- **ADMIN_ID**: `5220076610` (95% discount on Telegram Stars gifts, paying 5% of official Stars price)
- **Referral Reward**: `0.30` TON per unique valid referral

## Real Database Engine
- Uses **PostgreSQL** (`pg` transactions + row locks `FOR UPDATE`) whenever `DATABASE_URL` is provided in `.env` or hosting environment variables, and automatically creates tables (`users`, `referrals`, `transactions`, `gifts_cache`) from `data/schema.sql`.
- Falls back cleanly to atomic JSON persistence (`data/db.json` or `/tmp/epic-gift-data/db.json`) when running without `DATABASE_URL`.

## Quick Run
```bash
npm install
cp .env.example .env
# Add your real PostgreSQL DATABASE_URL in .env
npm start
```
