# Honorarios Tracker

A collaborative honorarios (fees) tracking web application for managing payment statuses across months for a list of service providers (prestadores).

## Architecture

- **Frontend**: React + Vite (port 5000)
- **Database**: Firebase Firestore (optional — app works in local mode without it)
- **Styling**: Tailwind CSS v4

## Project Structure

```
/
├── index.html          # HTML entry point
├── vite.config.js      # Vite config (host: 0.0.0.0, port: 5000, allowedHosts: true)
├── tailwind.config.js  # Tailwind CSS config
├── postcss.config.js   # PostCSS config (uses @tailwindcss/postcss)
├── package.json        # Node.js dependencies
├── src/
│   ├── main.jsx        # React entry point
│   ├── App.jsx         # Main application component
│   └── index.css       # Tailwind CSS imports
└── index.js            # Original source file (kept for reference)
```

## Features

- Track payment status for 120+ service providers across 12 months
- Six status states: Pendiente, Recibido, Enviado, Devuelto, Subsanado, Pagado
- Search/filter providers by name
- Real-time sync via Firebase Firestore (when configured)
- Local mode (no Firebase needed for basic use)

## Firebase Setup (Optional)

To enable real-time collaborative sync, set these environment variables:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_APP_ID` (optional, defaults to `honorarios-tracker-v1`)

## Development

```bash
npm run dev    # Start dev server on port 5000
npm run build  # Build for production
```

## Deployment

Configured as a static site deployment:
- Build command: `npm run build`
- Public directory: `dist`
