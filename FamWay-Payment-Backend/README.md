# FamWay-Payment-Backend

Node.js + Express + MongoDB API for the FamWay Merchant app.

## Run locally (Termux)

```bash
npm install
cp .env.example .env     # fill MONGODB_URI
npm run seed             # prints a demo merchant ID
npm run dev
```

## API

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Health check (503 if DB is down) |
| POST | `/api/payment-links` | Create a link. Body: `merchantId`, `amount` (rupees), optional `title`, `description`, `customerName`, `expiresAt` |
| GET | `/api/payment-links/:merchantId` | List links. Query: `status`, `page`, `limit` |
| GET | `/api/orders/:merchantId` | List orders. Query: `status`, `page`, `limit` |

```bash
curl -X POST http://localhost:8000/api/payment-links \
  -H "Content-Type: application/json" \
  -d '{"merchantId":"<ID>","amount":1500,"description":"Order #12"}'
```

## Deploy on Koyeb

1. **MongoDB Atlas:** create a cluster and a database user. Under Network Access
   allow `0.0.0.0/0` (Koyeb IPs are not fixed). Copy the connection string.
2. **GitHub:** commit everything including `package-lock.json`, then push.
   Make sure `.env` is not committed.
3. **Koyeb:** Create Service, choose GitHub, select the repo.
4. **Builder:** choose Dockerfile.
5. **Environment variables:** add `NODE_ENV=production`, `MONGODB_URI`,
   `CORS_ORIGINS`, `PUBLIC_BASE_URL`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`,
   `RAZORPAY_WEBHOOK_SECRET`. Store the secrets as Koyeb Secrets.
6. **Port:** 8000 (HTTP). **Health check:** HTTP, path `/health`.
7. Deploy, then open `https://<your-app>.koyeb.app/health`.

## Security notes

- The Razorpay secret lives only in server environment variables and is never
  returned by any endpoint. Only the public key ID may be sent to clients.
- Only `rzp_test_` keys are accepted.
- **No authentication yet.** Add JWT auth before real use.
