# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the project

```bash
node server.js
```

Opens at `http://localhost:3000`. There is no build step — `server.js` is a static file server (Express 5) that serves everything in `public/`.

## Architecture

This is a single-page chat widget with no frontend framework or bundler.

- **`server.js`** — minimal Express 5 static server. Its only job is to serve `public/`.
- **`public/index.html`** — the entire application: HTML structure, all CSS (in `<style>`), and all JS (in `<script>`). No external JS files.

### How the chat works

1. **Auth**: Google Identity Services (`accounts.google.com/gsi/client`) handles login. The JWT is decoded client-side via `parseJwt()` to extract `name`, `email`, and `picture`.
2. **Sending messages**: `sendMessage()` POSTs a structured JSON payload to an n8n webhook. The payload shape is `{ instancia: {...}, message: { id, chat_id, username, content, content_type, timestamp } }`.
3. **Rendering responses**: `parseMarkdown()` processes the AI response before inserting it into the DOM — handles `**bold**`, `- `/ `* ` lists → `<ul><li>`, `\n` → `<br>`, and bare URLs → `.chat-action-link` buttons.
4. **Reset**: Sends `{ action: "reset_memory", userId: email }` to the same webhook. The n8n flow should filter by `action` to handle this separately.

### Key JS variables (global state)

| Variable | Purpose |
|---|---|
| `userEmail` | Set after Google login, used as `chat_id` in payloads |
| `userName` | Full name from Google JWT |
| `userFirstName` | Given name (from `data.given_name` or first two words of full name) |
| `userPhotoUrl` | Profile photo URL from `data.picture` in Google JWT |
| `isLoading` | Guards against duplicate sends while awaiting n8n response |

### Webhook URL

Hardcoded in two places in `index.html`:
- `sendMessage()` — main chat webhook
- `resetConversation()` — same URL, differentiated by `action: "reset_memory"` in the payload

To change the endpoint, update both occurrences. The variable is labelled `RESET_WEBHOOK` in `resetConversation()`.
