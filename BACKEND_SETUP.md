# Backend Integration Setup Guide

This guide covers the integration of Supabase, Stripe, and Resend for the Chi Link booking system.

## 1. Supabase Setup

### Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your `Project URL` and `Anon Key` from Settings > API
4. Add to `.env.local`:
   ```
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

### Database Schema
Create these tables in Supabase SQL Editor:

```sql
-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service TEXT NOT NULL,
  location TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  notes TEXT,
  stripe_payment_id TEXT,
  total_price NUMERIC,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMP DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_bookings_email ON bookings(email);
CREATE INDEX idx_bookings_date ON bookings(date);
CREATE INDEX idx_bookings_status ON bookings(status);
```

## 2. Stripe Setup

### Create Stripe Account
1. Go to [stripe.com](https://stripe.com)
2. Create account and verify email
3. Get `Publishable Key` from Dashboard > Developers > API Keys
4. Add to `.env.local`:
   ```
   VITE_STRIPE_PUBLIC_KEY=pk_test_...
   ```

### Pricing Setup
Define service prices in your code:
- Acupuncture: $65-85
- Deep Tissue Massage: $55-90
- Head Spa: $75-95
- Cupping: $45-75
- Herbal: $50-80
- Reflexology: $50-70
- Couples: $110-140

## 3. Resend Setup

### Create Resend Account
1. Go to [resend.com](https://resend.com)
2. Create account
3. Get API Key from settings
4. Add to `.env.local`:
   ```
   VITE_RESEND_API_KEY=re_...
   ```

### Email Templates
Create email templates for:
- Customer booking confirmation
- Admin notification

## 4. Backend API Routes Required

Create these API routes (Node.js/Express example):

### POST `/api/create-payment-intent`
- Accept: `{ amount: number, email: string }`
- Return: `{ clientSecret: string }`

### POST `/api/send-booking-email`
- Accept: booking details
- Use Resend to send confirmation to customer

### POST `/api/send-admin-notification`
- Accept: booking details
- Use Resend to send notification to admin

## 5. Environment Variables

### .env.local (Frontend)
```
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
VITE_STRIPE_PUBLIC_KEY=pk_test_...
VITE_RESEND_API_KEY=re_...
```

### .env (Backend)
```
STRIPE_SECRET_KEY=sk_test_...
RESEND_API_KEY=re_...
SUPABASE_URL=your_url
SUPABASE_SERVICE_KEY=your_service_key
```

## 6. Next Steps

1. Set up Supabase database with the schema above
2. Create backend API routes for payments and emails
3. Get Stripe and Resend API keys
4. Update environment variables
5. Test the booking flow end-to-end
6. Configure webhook endpoints for Stripe payment confirmation

## File Structure

```
app/
├── src/
│   ├── lib/
│   │   ├── supabase.ts       (✓ Created)
│   │   ├── bookingApi.ts     (✓ Created)
│   │   ├── stripe.ts         (✓ Created)
│   │   └── email.ts          (✓ Created)
│   ├── pages/
│   │   └── BookingPage.tsx   (Existing - needs payment integration)
│   └── components/
│       └── Navigation.tsx    (✓ Fixed)
├── .env.local                 (✓ Created - needs values)
└── package.json             (✓ Updated with dependencies)
```

## Testing Checklist

- [ ] Supabase database created and tables set up
- [ ] Stripe account created and keys added
- [ ] Resend account created and keys added
- [ ] API routes implemented
- [ ] Booking form submits to database
- [ ] Payment flow works
- [ ] Customer receives confirmation email
- [ ] Admin receives notification email
- [ ] Booking visible in admin dashboard
