# AutoMind Ventures Web App

AutoMind Ventures is a Next.js web application that connects vehicle owners and automobile technicians through a paid, WhatsApp-based system.

## Tech Stack

- Next.js (App Router)
- React 18
- Tailwind CSS
- lucide-react for icons
- MongoDB with Mongoose

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Configure environment:

Create a `.env.local` file in the project root:

```bash
MONGODB_URI="your-mongodb-connection-string"
```

3. Run the development server:

```bash
npm run dev
```

Then open `http://localhost:3000` in your browser.

## User Flow

1. Landing page (`/`) with a clear "Get Started" call to action.
2. Registration page (`/register`) where users provide contact details and choose a role (vehicle owner or technician).
3. Payment page (`/payment`) shows dynamic pricing based on role and simulates a Paystack/Flutterwave payment.
4. Form page (`/form`) captures vehicle details for owners (or optional specialization for technicians).
5. Success page (`/success`) summarizes details and deep-links into WhatsApp with a pre-formatted message.

## Notes

- Payment and verification are stubbed for demo purposes. Integrate Paystack or Flutterwave in `lib/payment/paystack.ts` and `/pages/api/payment/verify.ts` for production usage.
- Ensure MongoDB is running and `MONGODB_URI` is correctly configured before relying on persistence.

