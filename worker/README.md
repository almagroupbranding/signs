# Secure AI worker

This Cloudflare Worker keeps the OpenAI key off GitHub Pages.

## Deploy

From this folder:

```bash
npx wrangler login
npx wrangler secret put OPENAI_API_KEY
npx wrangler deploy
```

Copy the resulting worker URL into `/config.js`:

```js
window.PUB_SIGN_API_URL = "https://pub-sign-ai.YOUR-SUBDOMAIN.workers.dev";
```

The endpoint accepts uploaded images/PDFs, calls the OpenAI Responses API with vision and strict structured output, and returns:

- inferred brand tokens
- extracted original copy
- suggested copy
- sign types
- manual-review flags

Never commit the API key.
