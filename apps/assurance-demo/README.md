# MoveTrack Fleet + SHE frontend preview

This Vite preview imports the **existing** MoveTrack and Operational Assurance React components from `apps/web`. No separate clone, mock UI, auth, Firebase, OAuth, API or cloud database is needed.

```sh
pnpm install
pnpm --filter @bokang/assurance-demo dev
pnpm --filter @bokang/assurance-demo build
```

After opening the preview, choose one of the test scenario cards. The button *Open driver mobile app* uses `/driver/move-track?driver=DRV-001`; visit the manager demo via `/`. Any completed forms, assignment changes, NO-GO, grounding, incident, repair or release records live in this browser's localStorage.

On Cloudflare Pages, use project root `/`, build command `pnpm --filter @bokang/assurance-demo build`, build output directory `apps/assurance-demo/dist`, Node.js 22 (or compatible).

**Safety disclaimer:** browser-only simulations must never be used to authorize actual vehicle or equipment movements. Firebase/Google Drive services are postponed.
