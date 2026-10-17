# Botswana Cultural Explorer — existing Studio product

**Working branch:** `showcase/cloudflare-client-demos`  
**Product slug:** `botswana-cultural-explorer`  
**Developer:** Bokang Jobe  
**Public marketplace:** `/demo/botswana-cultural-explorer`  
**Seller workspace:** `/products/botswana-cultural-explorer`  
**Permanent host, upon successful Cloudflare deployment:** `https://bokang-industry-app-studio.lexjobe2.workers.dev`

## Why a Studio product and not a rebuilt application

This implementation extends the existing monorepo, `@bokang/app-config` product registry, shared demo routing, `ProductExperience`, Studio dashboard, Next.js web app, local persistence library and permanent Workers deployment. Existing industry products and the prospects pipeline are untouched.

## Implemented frontend features

- Distinct culture-first public shopping experience with editorial Botswana Tourism Organisation references.
- Category browsing, town filter, store search, saved items, item details and approximate location maps.
- Browser-local seller signup/onboarding: shop, venue or mixed; owner, public phone, optional WhatsApp, cultural story and opening hours.
- Product inventory: publish/draft, stock, price in BWP, descriptions, photo compression, edit/delete.
- Venue management: capacity, offerings, rate notes, preferred-date enquiry and manual review status.
- Seller-selected **public general town pin** or explicitly approved **precise GPS coordinates** via browser geolocation. No geolocation request in general-town mode.
- Keyless OpenStreetMap embed for map preview with attribution; no bulk tile prefetch.
- Cash, Orange Money, MyZaka, Smega and bank transfer **only by arrangement**. No online checkout, no card acceptance and no claim that a payment has been made.
- Multi-item WhatsApp enquiry basket groups items by seller and encodes product name, quantity, unit price and total into a `wa.me` URL. Links are shown only for seller-provided valid Botswana mobile numbers. Nothing sends without the buyer choosing to send in WhatsApp.
- Call seller links when a public phone is available.
- Separate client-store data and public demo item catalog with clearly labelled fictional sample sellers.
- Downloadable JSON backup of local seller records.

## Known scope limitations (intentional)

**Frontend-only working phase**. Firebase Authentication and Google Drive storage are **not configured or operational**. There are no real user accounts, secure ownership checks, synced devices, live stock locks, server booking confirmations, SMS, notifications, or background WhatsApp syncing. A browser-local enquiry is visible only in the same browser's seller workspace. Never describe it as received by a real host. Photos are compressed and stored in browser localStorage, **not** uploaded to Google Drive. Browser storage can be lost.

Illustrative product listings must not be mistaken for active real-world shops or sale offers. Editorial cultural places are linked to Botswana Tourism Organisation and are not bookable through this demo.

## Future full-stack integration contracts

The domain file `apps/web/lib/botswana-culture.ts` includes `CultureIdentityPort` and `CultureStoragePort` with deliberately unconnected status flags.

1. **Firebase Authentication (future)**: Google sign-in; first-login onboarding and returning-user restoration; Firebase token checked server-side; security rules / server authorization validate UID and seller/store ownership for every mutation; do not accept a user-supplied UID as authority. Prevent a lapsed session from being mistaken for a first-time user.
2. **Google Drive user-owned storage (future)**: explicit Drive scopes and user consent; keep app-created files in an app-data area or user-approved folder according to permissions; searchable manifest, versioned snapshots, manifest hashes and resilient media uploads. Save all storefronts, inventory, venue enquiries, bookings, store media and activity state. Restore the whole state (not just the store profile) after reauthentication. Do not claim device localStorage represents Drive persistence. Respect quota and revisions/conflicts.
3. **API boundary (future)**: server-side validation for listings, seller contact, venue capacity, booking state, product quantity and file types; signed auth token, input rate limits, abuse reporting, publication controls and audit trail. Validate that sellers own each store and its child records. Consider moderators for unsafe/inaccurate cultural claims and illegal/counterfeit products.
4. **Commerce and messaging (future)**: no online card/mobile-money transactions. Store payment *preferences* only; seller negotiates cash/mobile-money outside the app. Do not automatically mark payment complete from WhatsApp. Support vendor inquiry threads in a future authenticated app if appropriate, without fabricating WhatsApp delivery or order status.
5. **Cultural stewardship**: support provenance, creator attribution, rights to photographs and designs, language variants (Setswana/English), community consent for heritage sites and culturally sensitive or restricted artefacts.
6. **Maps**: OpenStreetMap data © contributors. Public OSM tile infrastructure is best-effort and subject to its [tile usage policy](https://operations.osmfoundation.org/policies/tiles/). Do not download offline/bulk tiles; choose a sustainable provider or hosted infrastructure for scale. This prototype uses a limited map iframe. Location search is an offline filtered list of Botswana towns with a direct link to OSM public search. It does not send repeated background geocoding requests.

## Required verification

- `pnpm typecheck`
- `pnpm build`
- `pnpm --filter @bokang/web exec opennextjs-cloudflare build`
- Stable `pnpm exec wrangler deploy` via configured GitHub Actions Cloudflare workflow, **never** `--temporary`.
- Browser tests at 320, 375, 390, 430, 768 and 1280 pixels with keyboard navigation; merchant onboarding, GPS-denied path, public store share link, inventory + cart, WhatsApp encoding and same-browser venue enquiry.
- Cross-device, auth and Drive restore tests are intentionally **out of scope** until those backends are enabled.

## Source grounding

Product inspiration is based on Botswana Tourism Organisation [arts and crafts](https://www.botswanatourism.co.bw/arts-and-crafts) and [Tsodilo Hills](https://www.botswanatourism.co.bw/explore/tsodilo-hills). Sample stores are fictional and their prices are explicitly illustrative.
