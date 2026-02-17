# DL Speaks

**Repo:** [github.com/zYasuo/dl-speaks](https://github.com/zYasuo/dl-speaks)

Personal project I built to study English at home. The idea is having a dictionary at hand: look up a word, see definitions, phonetic transcription, pronunciation audio, examples and synonyms — and keep the ones I've looked up recently so I can review them.

## What's in here

- **Login** — sign in with email/password (separate backend).
- **Dashboard** — Home (profile) and **Dictionary**.
- **Dictionary / Words** — search field with suggestions from recent words. I search for a word, the API returns definitions, part of speech, examples, audio (when available) and lets me add to favorites.
- **Recent words** — clickable badges with the last words I searched; click again and it loads the result.

Stack: Next.js 16 (App Router), React 19, TypeScript, Tailwind, Zustand, forms with react-hook-form + zod, UI with shadcn-style components.

## Run in development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The frontend calls a backend at another URL; you need to set the env variable:

```env
BACKEND_URL=https://your-api.com
```

(or whatever your backend base URL is)

## Scripts

| Command        | Description        |
|----------------|--------------------|
| `npm run dev`  | Dev server         |
| `npm run build`| Production build   |
| `npm run start`| Run production build |
| `npm run lint` | ESLint             |

---

Built for my own use; feel free to [clone and adapt](https://github.com/zYasuo/dl-speaks) if you want.
