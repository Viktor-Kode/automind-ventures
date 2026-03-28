# AutoMind Ventures Web App

AutoMind Ventures is a Next.js web application that connects vehicle owners and automobile technicians through a manual bank payment, receipt upload, and WhatsApp handoff.

**Production:** [automind-ventures.vercel.app](https://automind-ventures.vercel.app)

## Tech Stack

- Next.js (App Router)
- React 18
- Tailwind CSS
- lucide-react
- MongoDB with Mongoose (receipt images stored on the user record)

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Configure environment:

Copy `.env.example` to `.env.local` and set values (see below).

3. Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

| Variable | Description |
| -------- | ----------- |
| `NEXT_PUBLIC_SITE_URL` | Public site URL (default: `https://automind-ventures.vercel.app`) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Business WhatsApp for deep links (e.g. `2348055906616`) |
| `MONGODB_URI` | MongoDB connection string; if unset, demo user IDs are used and receipt previews stay in the browser session only |

## User Flow

1. Landing (`/`) → Get Started  
2. Registration (`/register`) → `POST /api/auth/register`  
3. Bank details (`/payment-details`) → user pays offline  
4. Form (`/form`) → vehicle details (owners) or optional specialization (technicians), receipt upload  
5. Success (`/success`) → WhatsApp with pre-filled message  

## Deploying on Vercel

1. Import this repo and set **Root Directory** to the project root (if applicable).  
2. Add environment variables in the Vercel project settings (at minimum `MONGODB_URI`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_WHATSAPP_NUMBER`).  
3. Deploy; production URL: `https://automind-ventures.vercel.app` (or your assigned domain).

## Notes

- With `MONGODB_URI` set, receipt images are stored in MongoDB and served at `/api/receipt/[userId]`.  
- Without MongoDB, demo user IDs are used and the receipt preview is kept in `sessionStorage` only; the WhatsApp message lists the receipt as &quot;Uploaded&quot;.
