# Deployment and Rebuild Guide

This is a clean checklist for rebuilding and deploying Home of Electronics.

## 1) Environment Variables (copy to Vercel)

Add these in Vercel: **Project Settings -> Environment Variables**

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_GEMINI_API_KEY`

Use `.env.example` as the template.

## 2) Deploy to Vercel

1. Push repository to GitHub.
2. In Vercel: **Add New Project** -> import this repository.
3. Framework preset: **Vite**.
4. Build command: `npm run build`
5. Output directory: `dist`
6. Add env vars above.
7. Deploy.

## 3) Domain and URLs

After domain is connected, update these files with your final domain:

- `index.html` canonical URL
- `index.html` Open Graph URL/image
- `public/sitemap.xml`
- `public/robots.txt`

Current placeholder domain:

- `https://homeofelectronics.rw`

## 4) SEO Setup Included

Already added:

- Title + description + keywords
- Open Graph + Twitter tags
- Canonical tag
- JSON-LD schema for `ElectronicsStore`
- `robots.txt`
- `sitemap.xml`

## 5) Google Search Console Setup

1. Open [Google Search Console](https://search.google.com/search-console).
2. Add property (your production domain).
3. Verify ownership:
   - easiest method: HTML tag.
4. Replace this value in `index.html`:
   - `REPLACE_WITH_GOOGLE_SEARCH_CONSOLE_VERIFICATION`
5. Submit sitemap URL:
   - `https://YOUR_DOMAIN/sitemap.xml`

## 6) Google Business Profile Setup

1. Open [Google Business Profile](https://www.google.com/business/).
2. Claim/create business: **Home of Electronics**.
3. Add:
   - Category: Electronics store
   - Phone: `+250 780 615 795`
   - Email: `homeofelectronics20@gmail.com`
   - Address: Around Makuza Peace Plaza, Kigali
   - Website: your production URL
4. Add logo, cover photo, opening hours, and products.
5. Keep NAP consistency (Name/Address/Phone) same as website and social pages.

## 7) Rebuild Locally

1. `npm install`
2. Create `.env` from `.env.example`
3. `npm run dev`
4. `npm run build`
5. `npm run preview`

## 8) Optional Production Improvements

- Add dynamic Open Graph images per page
- Add analytics (GA4, Plausible, etc.)
- Add server-side WhatsApp Business API integration for media attachments
