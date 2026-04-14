# MUFIED Admin UI

Angular admin portal for editing the home-page content document stored through the Nest admin API.

## What it does

- Loads the full home-page document from `GET /api/admin/home-content`
- Saves the same document back with `PUT /api/admin/home-content`
- Exposes mobile-first editing controls for hero, intro, programmes, admission, publications, and footer content
- Includes a compact mobile preview and sticky publish controls for touch devices

## Run locally

1. Start the Nest API in `../api`
2. Run `npm start` inside `admin-ui`
3. Open `http://localhost:4200`

`npm start` uses `proxy.conf.json`, so `/api/*` requests are forwarded to `http://localhost:8081` by default.

Default API configuration lives in `src/assets/api.json`.

For local development, keep `"baseUrl": ""` in that file so requests use the Angular proxy.

If your API is hosted elsewhere, update that file or enter a different base URL in the portal header and reload content.
