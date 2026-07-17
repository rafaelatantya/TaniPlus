# TaniPlus

TaniPlus is a responsive web dashboard for monitoring agricultural sensor boxes. It presents sensor conditions, recommendations, device information, and per-user box customization through a mobile-first interface.

Production: [taniplus.vercel.app](https://taniplus.vercel.app)

## Features

- User registration, login, session persistence, and logout
- Redis-backed users with securely hashed passwords
- Predefined sensor boxes with good, maintenance, and error states
- Stable randomized sensor data for each user
- Sensor detail pages and device information
- Per-user box renaming stored in the browser
- Responsive React interface based on the TaniPlus design system

## Tech Stack

- React 19 and TypeScript
- Vite
- Vercel Functions
- Upstash Redis
- Vercel hosting and GitHub autodeploy

## Local Development

Requirements:

- Node.js 22 or a compatible version from `package.json`
- A Vercel account connected to the project
- An Upstash Redis database connected through Vercel

Install dependencies:

```bash
npm ci
```

Link the local repository and pull the project environment:

```bash
npx vercel link
npx vercel env pull .env.local --environment=production
```

Sensitive Vercel variables may be downloaded as `[SENSITIVE]`. If that happens, copy the actual Redis URL and token from the Upstash dashboard into `.env.local`.

Required variables:

```env
KV_REST_API_URL=
KV_REST_API_TOKEN=
SESSION_SECRET=
DEFAULT_USER_PASSWORD=
```

Run the complete application, including Vercel Functions:

```bash
npx vercel dev
```

Open [localhost:3000](http://localhost:3000).

`npm run dev` starts only the Vite frontend, so authentication endpoints are unavailable when using that command alone.

## Available Scripts

```bash
npm run dev      # Start the Vite frontend only
npm run build    # Type-check and create a production build
npm run preview  # Preview the production build
```

## Data Model

Upstash Redis stores user accounts and sessions. Passwords are hashed before storage and session identifiers are kept in HTTP-only cookies.

Sensor boxes and their status distribution are predefined. Sensor values are generated deterministically per user, while custom box names are stored in `localStorage` under a user-specific key. Renamed boxes therefore persist in the same browser but do not synchronize between devices.

## Deployment

The GitHub repository is connected directly to Vercel:

- Pushes to `main` trigger a production deployment.
- Pull requests receive Vercel preview deployments.
- GitHub Actions performs dependency installation and a production build check.
- Deployment is not duplicated inside GitHub Actions.

Never commit `.env.local`, Redis credentials, session secrets, or service-role credentials.
