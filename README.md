# Pub Sign Pack Builder

Browser-based MVP for creating consistent pub, restaurant, bar and cafe signage.

## Run locally

No install or build step is needed:

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## Included

- Demo venue with pizza menu, lunch menu, payment notice and reserved sign
- Venue and brand intake
- Local logo, photo and PDF uploads
- Twelve sign types
- Editable copy and exact-wording protection
- Three design styles
- Individual PDF, combined PDF and ZIP exports
- Pre-export checks and draft watermark

Jobs are stored in the browser on the current device. Files are not uploaded to a server.

## OpenAI analysis

The primary workflow is now upload-first:

1. Upload current sign/menu photos, PDFs, logo and venue references.
2. AI infers the brand and extracts each sign.
3. Review original wording beside suggested improvements.
4. Approve the original, suggestion or an edited version.
5. Generate and export the pack.

The secure endpoint is included in `/worker`. Deploy it and set its URL in `config.js`. The OpenAI key stays in the worker environment and is never placed in browser code.

## Limitations

- Browser data is device-specific.
- No automatic OCR or Word document parsing.
- PDF exports use standard embedded fonts.
- A printer should confirm bleed and colour requirements before a large print run.
