# Scopeify — Commercial Roofing Proposals

A SaaS web app for commercial roofing contractors to generate professional, branded PDF proposals in minutes. Three workflow paths: Proposal Builder, Quick Estimate, and Full Assessment — all powered by AI scope generation (Groq) and Puppeteer PDF rendering.

## Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account (free tier works)
- A [Groq](https://console.groq.com) account (free tier works)
- A [Vercel](https://vercel.com) account for deployment

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Project Settings → API (keep secret) |
| `GROQ_API_KEY` | console.groq.com → API Keys |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` locally, your Vercel URL in production |

## Supabase Setup

1. Create a new Supabase project
2. Go to **SQL Editor** and run the contents of `supabase/schema.sql`
3. Go to **Storage** and create three **public** buckets:
   - `company-assets`
   - `proposal-photos`
   - `proposal-pdfs`
4. Go to **Authentication → URL Configuration** and set:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: add `http://localhost:3000/auth/callback`

## Local Development

```bash
cp .env.local.example .env.local
# Fill in your environment variables

npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign up with your email.

## Deploy to Vercel

1. Push this repository to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add all environment variables from `.env.local` in Vercel project settings
4. Set `NEXT_PUBLIC_SITE_URL` to your Vercel production URL
5. Deploy

### Post-Deploy (Required)
In Supabase → **Authentication → URL Configuration**:
- Update Site URL to your Vercel URL
- Add `https://your-app.vercel.app/auth/callback` to Redirect URLs

## MVP Limitations

- PDF generation uses `@sparticuz/chromium` which works on Vercel serverless functions but may time out on large proposals — Vercel Pro allows 60s function timeout vs 10s on Hobby
- Photos must be publicly accessible in Supabase Storage for Puppeteer to embed them in PDFs
- Regional pricing table only has seed data for IL, TX, FL, CA, NY, OH — other states use fallback pricing
- Magic links are sent by Supabase's built-in email provider; configure custom SMTP (Resend) in Supabase Settings → Auth → SMTP for production
- One company per auth user — no multi-user team support in this MVP
