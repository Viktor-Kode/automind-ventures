# AutoMind Ventures Web App

AutoMind Ventures is a Next.js web application that connects vehicle owners and automobile technicians through a manual bank payment, receipt upload, and WhatsApp handoff.

**Production:** [automind-ventures.vercel.app](https://automind-ventures.vercel.app)

## Tech Stack

- Next.js (App Router)
- React 18
- Tailwind CSS
- lucide-react

There is **no database**: registration and form data live in the browser session; the API only validates input and returns a data-URL receipt for the success screen. The WhatsApp message lists the receipt as &quot;Uploaded&quot;.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Optional: copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` / `NEXT_PUBLIC_WHATSAPP_NUMBER` if you need overrides.

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

## User Flow

1. Landing (`/`) → Get Started  
2. Registration (`/register`) → `POST /api/auth/register`  
3. Bank details (`/payment-details`) → user pays offline  
4. Form (`/form`) → vehicle details (owners) or optional specialization (technicians), receipt upload  
5. Success (`/success`) → WhatsApp with pre-filled message  

## Deploying on Vercel

1. Import this repo.  
2. Optionally set `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_WHATSAPP_NUMBER`.  
3. Deploy.

## Notes

- Remove `MONGODB_URI` from Vercel if it was added earlier; it is unused.
