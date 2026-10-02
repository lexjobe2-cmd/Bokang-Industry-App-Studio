# Bokang Industry App Studio

A reusable, backend-light application studio for turning real business opportunities into production-oriented industry apps.

**Designed & developed by Bokang Jobe**

## Product family

The repository starts with eight products built on one shared architecture:

| Product | Sector | Core purpose |
| --- | --- | --- |
| LexIntake AI | Legal | Client intake, consultations, matters and documents |
| LedgerDesk AI | Accounting | Client onboarding, accounting work and document collection |
| TaxFlow AI | Tax | Questionnaires, tax returns, review, submissions and deadlines |
| ClinicFlow AI | Healthcare | Patients, practitioners, appointments, intake and clinic operations |
| PharmaDesk AI | Pharmacy | Medicine inventory, batches, expiry, suppliers, orders, prescriptions and dispensing |
| BuildQuote AI | Construction | Leads, quotations, projects, milestones and materials |
| ExploreBW AI | Tourism | Experiences, itineraries, bookings, travellers and maps |
| MoveTrack AI | Logistics | Quotes, jobs, fleet, drivers, delivery tracking and proof of delivery |

## Shared product architecture

This is intentionally **not eight unrelated codebases**.

The studio uses a config-driven monorepo:

```text
apps/
  web/                   shared adaptive frontend runtime

packages/
  app-config/            product names, modules, navigation and dashboard configuration
  ui/                    reusable product shell, navigation, cards and form primitives
  domain-data/           Botswana and industry-specific reusable form arrays
  integrations/          Google/Microsoft workspace and storage-snapshot contracts
```

Each product inherits the same system-level capabilities while keeping its own domain modules and frontend identity.

## UX rules

- Desktop/tablet uses a full workspace navigation shell.
- Mobile web uses a fixed five-tab bottom navigation inspired by familiar social/mobile application patterns.
- Layouts are adaptive and responsive rather than desktop pages merely squeezed onto a phone.
- Reusable arrays, chips, selectors and presets should be preferred over repetitive free-text input.
- Dashboards are built around reusable metric and chart components.
- UI foundation is Tailwind CSS + shadcn/ui-compatible primitives + Lucide icons.
- Recharts is the default charting library.
- Every product must display **Designed & developed by Bokang Jobe** in an appropriate footer/about surface.

## Backend-light data strategy

The long-term architecture favors the customer's own workspace rather than making this studio the permanent owner of every business file.

Supported integration direction:

- Google Drive
- Gmail
- Google Sheets
- Microsoft OneDrive
- SharePoint
- Excel
- Outlook

Redis is for ephemeral coordination such as caching, rate limits, queues, notification state and snapshot indexes. Sensitive long-lived legal, tax, medical or business documents should live in the user's connected workspace whenever practical.

## Storage snapshots

Every product will gain a shared Storage & Snapshots workspace that can show:

- app-created folders/files,
- estimated storage use,
- large-file categories,
- old/generated temporary files,
- snapshot history,
- export/archive actions,
- cleanup suggestions,
- connection revocation.

The goal is to let users understand and manage the storage consumed by the app inside their own connected account.

## PharmaDesk AI medicine management

PharmaDesk AI is not just a pharmacy marketing frontend. Medicine management is a first-class operational workspace including:

- medicine catalogue,
- dosage/form metadata,
- batches and lot tracking,
- quantities on hand,
- reorder thresholds,
- low-stock signals,
- expiry tracking,
- quarantined/recalled stock states,
- suppliers,
- purchase orders and receiving,
- prescription intake,
- dispensing workflow,
- dispensing records,
- stock adjustments,
- pharmacy analytics.

This is deliberately separate from ClinicFlow AI, which focuses on clinic appointments, practitioners, patients, intake, documents and reminders.

## Maps and location

Where mapping is needed, the product direction is keyless/open mapping where practical, using OpenStreetMap-compatible data and map libraries. Production deployments must respect the relevant public tile/provider usage policies and should not assume unlimited free public infrastructure.

## Current foundation

The current branch establishes:

- pnpm + Turborepo workspace,
- strict shared TypeScript configuration,
- shared adaptive Next.js frontend,
- eight product configurations,
- reusable dashboard/product shell,
- five-tab mobile navigation,
- reusable Botswana and pharmacy form arrays,
- backend-light Google/Microsoft workspace contracts,
- storage snapshot contracts,
- Tailwind/shadcn-compatible frontend configuration,
- Recharts-ready dependency,
- GitHub Actions typecheck workflow.

## Local development

```bash
pnpm install
pnpm dev
```

Open the Studio launcher and select a product. Product routes are generated from the shared registry.

## Engineering rule

Features that are not genuinely industry-specific should be implemented once in a shared package and consumed by each frontend. We should only fork product behavior where the underlying workflow actually differs.


## Showcase implementation status

The first showcase-ready workflow pass is now implemented in product order.

### 1. LexIntake AI
- Guided client intake
- Botswana location presets
- Legal matter type presets
- Consultation mode presets
- Matter pipeline with editable stages
- Document review list
- Practice metrics and conversion snapshot

### 2. LedgerDesk AI
- Client onboarding
- Accounting engagement types
- Engagement status pipeline
- Missing-document tracking
- Document category presets
- Practice performance metrics

### 3. TaxFlow AI
- Tax return creation
- Return-type presets
- Tax workflow stages
- Deadline visibility
- Preparation checklist
- Tax operations metrics

### 4. ClinicFlow AI
- Appointment booking
- Appointment type presets
- Appointment state updates
- Patient workspace preview
- Follow-up visibility
- Clinic operations metrics

### 5. PharmaDesk AI
- Medicine inventory
- Dosage/form presets
- Batch tracking
- Quantity and reorder thresholds
- Expiry / near-expiry states
- Low-stock visibility
- Supplier references
- Purchase order workflow
- Prescription/dispensing queue
- Dispensing state changes

### 6. BuildQuote AI
- Quote lead capture
- Construction trade presets
- Site/project locations
- Quote pipeline stages
- Project progress preview
- Commercial metrics

### 7. ExploreBW AI
- Experience catalogue
- Destination filters
- Tourism experience presets
- Saved experiences
- Sample itinerary
- Booking enquiry workflow
- Operator dashboard metrics

### 8. MoveTrack AI
- Logistics job creation
- Job type presets
- Botswana origin/destination selectors
- Job status pipeline
- Fleet status
- Delivery and POD metrics

## Shared showcase capabilities

Every product now also includes:

- adaptive desktop workspace shell,
- fixed 5-tab mobile navigation,
- Google Workspace / Microsoft 365 connection-state preview,
- storage usage snapshot,
- refreshable snapshot demo,
- cleanup entry point,
- reusable Recharts activity dashboard,
- reusable product attribution,
- reusable domain arrays for faster input.

The current connected-workspace controls are showcase connection states only. OAuth scopes and real provider writes are intentionally deferred to the integration implementation phase; the UI does not falsely claim a live Google or Microsoft connection.


## Platform layer: persistence, admin, OAuth and coordination

The showcase foundation now includes a second platform layer shared by all eight products:

- durable browser persistence for product working state,
- persistent workspace identity, members, roles and notification preferences,
- per-product storage snapshot state,
- a shared `/products/[slug]/admin` workspace,
- optional Upstash Redis REST coordination with a local-only fallback,
- Google Workspace OAuth start/callback/disconnect routes,
- Microsoft 365 OAuth start/callback/disconnect routes,
- encrypted server-only OAuth token cookies,
- safe client-visible connection status without exposing access or refresh tokens.

### OAuth security boundary

Provider tokens are never written to `localStorage`.

OAuth callbacks encrypt token bundles using AES-256-GCM with `APP_ENCRYPTION_SECRET` and keep them in HTTP-only cookies. Client components receive only connection state and account labels.

Configure the provider callback URLs to match the deployment, for example:

```text
http://localhost:3000/api/oauth/google/callback
http://localhost:3000/api/oauth/microsoft/callback
```

For production, set `APP_BASE_URL` to the deployed HTTPS origin and register the matching callback URLs with Google and Microsoft.

Google currently requests identity plus Drive file, Gmail send and Sheets access. Microsoft currently requests identity, Files.ReadWrite and Mail.Send. SharePoint-specific permissions should only be added when the SharePoint workflow is implemented and the required scope is justified.

### Persisted product state

The current showcase collections now survive refresh/navigation:

- LexIntake matters/intakes,
- LedgerDesk engagements,
- TaxFlow returns,
- ClinicFlow appointments,
- PharmaDesk medicines and dispensing queue,
- BuildQuote leads,
- ExploreBW saved/experience state,
- MoveTrack jobs.

This browser persistence is a showcase/offline-friendly working layer. Production long-lived business documents remain intended for the user's authorized Google or Microsoft workspace.


## End-to-end showcase path

Every product now supports the same reusable showcase journey:

```text
Product launcher
→ product workspace
→ persisted domain CRUD
→ workspace onboarding
→ Google / Microsoft connection
→ connected file registry
→ storage snapshots
→ admin & members
→ Redis/platform health
```

The connected file registry stores file metadata only in browser persistence. File bytes are deliberately not written into browser storage. Once a provider is connected, the next connector implementation step is to stream uploads directly into the user's authorized Drive/OneDrive/SharePoint destination and persist only references/metadata in app state.

The shared onboarding route is available at:

```text
/products/<product-slug>/onboarding
```

The shared admin route is available at:

```text
/products/<product-slug>/admin
```


## Studio dashboard and outreach demos

The root route is now the operating dashboard for the showcase studio.

```text
/
```

It renders all eight industry applications in one responsive grid. Each card supports:

- **Open** — enter the internal product workspace,
- **Setup** — jump directly to that product's onboarding,
- **Preview** — open the prospect-facing demo,
- **Copy demo link** — copy an outreach-ready URL,
- **Share** — use the browser/device share sheet when available.

Enter the prospect or business name before generating the demo URL. The share format is:

```text
/demo/<product-slug>?client=<business-name>&source=outreach
```

Example:

```text
/demo/lex-intake?client=Dube%20%26%20Partners&source=outreach
```

The prospect-facing demo deliberately does **not** expose the Studio dashboard, admin/settings, onboarding, Redis controls or OAuth setup. It opens directly into the interactive industry workflow and clearly identifies itself as a concept demonstration.

Client demo state is scoped by product + prospect name, so previewing one prospect does not reuse another prospect's persisted demo interactions on the same browser.

## Showcase runtime vs integration foundation

For the current outreach/showcase phase:

- OAuth remains implemented foundation but is not required to run a client demo.
- Redis remains optional coordination foundation but is not required to run a client demo.
- Client demos use local interactive showcase state.
- Long-lived provider integrations can be enabled later without redesigning the product frontends.

This separation keeps Cloudflare-hosted outreach demos fast and self-contained while retaining the production integration architecture for later stages.

## Cloudflare Workers deployment

This existing Next.js application is configured for Cloudflare Workers using the OpenNext adapter.

Cloudflare files live under:

```text
apps/web/open-next.config.ts
apps/web/wrangler.jsonc
```

The Wrangler configuration enables `nodejs_compat`, points to the OpenNext Worker output and serves the OpenNext assets directory.

From the repository root:

```bash
pnpm install
pnpm preview:cf
pnpm deploy:cf
```

The showcase does not require Google, Microsoft or Redis credentials. Those variables are only needed when the dormant integration foundation is enabled.

For Cloudflare dashboard builds, install from the monorepo root so pnpm can resolve the shared workspace packages.
