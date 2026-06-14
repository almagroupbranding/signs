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

## OpenAI

This static GitHub Pages MVP works without an API key. Do not put an OpenAI key in browser code. AI extraction should be added later through a secure server endpoint.

## Limitations

- Browser data is device-specific.
- No automatic OCR or Word document parsing.
- PDF exports use standard embedded fonts.
- A printer should confirm bleed and colour requirements before a large print run.
