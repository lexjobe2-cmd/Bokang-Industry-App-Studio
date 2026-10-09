// The OpenNext adapter is resolved only by the optional Cloudflare Worker deployment.
// Keep the ordinary MoveTrack/Next.js frontend install independent of its AWS-SDK
// transitive dependency tree. OpenNext accepts a default no-overrides config.
export default {};
