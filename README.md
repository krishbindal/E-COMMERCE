# Student Project Marketplace

Full-stack production-ready marketplace built with Next.js 15 App Router, TypeScript, Tailwind CSS, Sanity, Razorpay, Firebase, Firestore, and Resend.

## Features

- Marketplace listing page (`/projects`) from Sanity CMS
- Dynamic project detail page (`/project/[id]`)
- Razorpay checkout with secure backend verification
- Firebase Authentication (Google + email/password)
- Firestore order management (`orders` collection)
- Custom project request flow (`/request`) with Firestore storage (`customRequests`)
- Post-payment and request email automation via Resend
- Admin dashboard (`/dashboard`) with protected admin-only access
- Modern responsive dark UI

## Required Environment Variables

```bash
# Firebase client
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase admin
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=

# Sanity
SANITY_PROJECT_ID=
SANITY_DATASET=
SANITY_API_VERSION=2024-01-01
SANITY_TOKEN=

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
NEXT_PUBLIC_RAZORPAY_KEY_ID=

# Resend + app config
RESEND_API_KEY=
FROM_EMAIL=
ADMIN_EMAIL=
NEXT_PUBLIC_ADMIN_EMAIL=
```

## Getting Started

```bash
npm install
npm run dev
```

## Production Checks

```bash
npm run lint
npm run build
```
