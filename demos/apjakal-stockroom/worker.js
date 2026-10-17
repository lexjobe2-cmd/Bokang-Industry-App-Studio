addEventListener("fetch", event => {
  event.respondWith((async () => {
    const url = new URL(event.request.url);
    if (url.pathname === "/health") {
      return new Response(JSON.stringify({
        ok: true,
        name: "Stockroom",
        frontend: "https://bokang-industry-app-studio.lexjobe2.workers.dev/stockroom",
        backend: "Browser-local demo; Python and SQLite run in separate local interview project"
      }), { headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
    }
    return Response.redirect("https://bokang-industry-app-studio.lexjobe2.workers.dev/stockroom", 302);
  })());
});