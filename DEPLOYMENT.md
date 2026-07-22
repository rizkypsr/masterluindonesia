# Deployment Guide - Niagahoster (Static SPA)

The site is deployed as a **static SPA** — no Node process runs in production.

Shared hosting counts every thread of a Node process against the CloudLinux
"Max Processes" (NPROC) limit of 120, and the Passenger-managed Nuxt server was
sitting at ~99 on average. Building with `nuxt generate` removes that process
entirely: Apache serves plain files, and all data is fetched client-side from
`api.masterluindonesia.com`.

## Build

```bash
npm run build   # runs `nuxt generate`
```

Output: `.output/public` (includes `.htaccess` from `public/`).

`NUXT_PUBLIC_*` env vars are **baked in at build time**. Changing an API URL
means rebuilding and re-uploading — there is no runtime config on the server.

## Deploy

1. Upload the **contents** of `.output/public` (not the folder itself) to
   `public_html`, including the dotfile `.htaccess`.
2. In cPanel → **Setup Node.js App**: **Stop** and then **Destroy** the old Node
   application. While it remains registered, Passenger can respawn it and NPROC
   stays high.
3. Delete leftovers of the old deployment on the server (`.output/server`, the
   app's `node_modules`) to free disk and inodes.

## Caching

Handled entirely by `public/.htaccess`:

- Hashed assets (`.js`, `.css`, `.woff2`, images): `max-age=31536000, immutable`
- HTML / JSON / webmanifest: `no-cache, no-store` — deploys are visible instantly
- gzip via `mod_deflate`; pre-compressed `.gz`/`.br` files are also emitted by the build

SPA routing: `.htaccess` rewrites any path that is not an existing file or
directory to `/index.html`, so deep links and refreshes work.

Verify:

```bash
curl -I https://your-domain.com/                  # no-store
curl -I https://your-domain.com/_nuxt/[file].js   # max-age=31536000
```

## Verifying the process count dropped

Over SSH:

```bash
ps -u $USER | grep node      # must be empty
ps -eLf -u $USER | wc -l     # total threads — should be a small number
```

Then check the "Proses Maksimal" graph in the panel after ~1 hour.

## Notes

- No SSR: pages ship an empty shell and render client-side, so dynamic content
  is not in the initial HTML (SEO trade-off accepted). If SEO becomes a concern,
  the upgrade path is selective prerendering at build time — still no Node in prod.
- Icons are inlined into the client bundle (`icon.clientBundle.scan` in
  `nuxt.config.ts`), so nothing is fetched from the Iconify API at runtime.
- Local smoke test of the real artifact: `npx serve .output/public -s`

## Troubleshooting

If users still see old content:

1. Check that `.htaccess` was uploaded (it is hidden — enable "show dotfiles" in File Manager)
2. Verify Apache `mod_headers` and `mod_rewrite` are enabled
3. Purge any CDN/proxy cache
4. Ask users to hard refresh (Ctrl+F5 / Cmd+Shift+R)
