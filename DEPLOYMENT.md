# Deployment Guide - Niagahoster

## Cache Issues Fixed

This project had caching issues causing 15min-1hour delays for users to see updates. The following fixes have been implemented:

### 1. Cache Control Headers (.htaccess)
- HTML files: No caching (users always get latest version)
- JS/CSS files: 1 year cache with immutable flag (safe because Nuxt adds hash to filenames)
- Images: 1 week cache
- Manifest/JSON: No caching

### 2. Nitro Route Rules (nuxt.config.ts)
- HTML pages: No cache
- Static assets in `/_nuxt/`: Long-term cache (safe with versioned filenames)

### 3. Build Versioning
- Nuxt automatically adds content hashes to JS/CSS filenames
- When you rebuild, new filenames are generated
- Old cached files won't be used

## Deployment Steps

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Upload to Niagahoster:**
   - Upload the entire `.output` folder
   - Make sure `.htaccess` from `public/` is in the root of your web directory

3. **Verify deployment:**
   - Clear your browser cache (Ctrl+Shift+Delete)
   - Visit your site
   - Check browser DevTools > Network tab to see Cache-Control headers

## Testing Cache Headers

After deployment, test with curl:
```bash
# Test HTML (should be no-cache)
curl -I https://your-domain.com/

# Test JS files (should be max-age=31536000)
curl -I https://your-domain.com/_nuxt/[some-file].js
```

## Important Notes

- **First deployment after this fix**: Users with old cached versions might still need to hard refresh (Ctrl+F5) once
- **Future deployments**: Updates will be instant because HTML is never cached
- **CDN/Proxy**: If Niagahoster uses a CDN, you may need to purge it after deployment

## Troubleshooting

If users still see old content:
1. Check if `.htaccess` is properly uploaded and in the correct location
2. Verify Apache `mod_headers` is enabled on your hosting
3. Check if there's a CDN/proxy cache that needs purging
4. Ask users to hard refresh (Ctrl+F5 or Cmd+Shift+R)
