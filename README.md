# CoilVision Frontend

React and TypeScript frontend for collecting coil inspection photos. This version is deliberately client-only: it does not call a backend API.

## Current features

- Open a live in-app camera view and capture a photo, or separately select multiple image files from the device.
- Build a request of up to 10 photos by default.
- Preview and remove individual images before saving.
- Save a photo set locally or mark it ready for future submission.
- Browse locally saved sets and delete an image, a set, or the whole library.
- Review per-image processing data and statuses: pending, detected, not detected, bad detection, and failed.
- Responsive Material UI design with desktop and mobile navigation.
- Persian right-to-left interface with locally bundled BYekan and Asap fonts.
- Static routing compatible with GitHub Pages.

Images are stored as blobs in IndexedDB, not localStorage. Unsaved selections live in a small Zustand store. TanStack React Query coordinates asynchronous IndexedDB operations and is ready for future server state.

## Local development

Requirements: Node.js 24 and npm.

```powershell
npm ci
npm run dev
```

Open `http://localhost:5173`.

Useful checks:

```powershell
npm run check
npm test
npm run build
```

## Configuration

Product limits are centralized in `src/config/app.config.ts`. Change `maxImagesPerRequest` there to adjust the maximum number of photos in a set. Supported image types, maximum image size, and IndexedDB settings are in the same file.

`.env.example` reserves `VITE_API_BASE_URL` for the future backend. It is not used by any endpoint in the current application.

## Source organization

```text
src/
  api/          Future HTTP boundary and shared Axios client
  app/          Providers, router, query client, and theme
  components/   Reusable application-wide UI
  config/       Product configuration
  features/     Feature-owned components, state, and rules
  hooks/        Reusable React hooks
  pages/        Route-level composition
  storage/      IndexedDB repository and React Query hooks
  types/        Domain models
  utils/        Framework-independent helpers
```

AI-assisted contributors should start with `.ai/README.md` and follow the rules stored there.

## Future API integration

Do not call Axios from pages or components. When the real GET and POST contracts are available, add domain endpoint functions below `src/api`, wrap them with React Query hooks, and map responses to the domain models. See `src/api/README.md` and `.ai/rules/api-integration.md`.

## GitHub Pages

The application uses `HashRouter` and a relative Vite base path, so repository project pages work without server rewrite rules. A deployment workflow is included at `.github/workflows/deploy-pages.yml` in the CoilVision project root. The workflow assumes `coilvision_ocr` is the GitHub repository root; if it remains a folder inside a larger repository, move the workflow to that repository's root `.github/workflows` directory and keep its `frontend` paths.

In the GitHub repository, open **Settings → Pages** and set **Source** to **GitHub Actions**. Push to `main`, or run the workflow manually from the Actions tab.

The live browser camera requires a secure origin and camera permission; GitHub Pages uses HTTPS. Localhost is also permitted by browsers. The gallery button never requests camera access, and the camera button never opens the file picker.

## Docker

Build and run the static Nginx image:

```powershell
docker compose up --build -d
```

Open `http://localhost:3000`. The container serves only the frontend and exposes `/healthz` for health checks; it does not proxy a backend.

## Local-data behavior

- Data belongs to the current browser profile and origin.
- Clearing site data removes the saved library.
- GitHub Pages, localhost, and the Docker origin each have separate IndexedDB storage.
- Browser storage quotas vary by device; save failures are shown to the user.
