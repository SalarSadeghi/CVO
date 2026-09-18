# Project context

CoilVision Frontend is a React + TypeScript application for collecting sets of coil photos and eventually submitting them for OCR processing.

Current product state:

- A set contains 1 to the configured maximum number of images (10 by default).
- Users can take photos, select multiple images, preview them, and remove mistakes.
- The camera action uses `getUserMedia` and a live in-app preview; it must remain separate from the gallery file picker.
- Sets and image blobs are persisted in IndexedDB on the current device.
- A set can be saved or marked ready for a future request.
- Every saved image starts with the processing status `pending`.
- There are deliberately no backend endpoint calls yet.
- GitHub Pages is the primary static deployment target; Docker/Nginx is also supported.
- The product UI is Persian and right-to-left. BYekan is bundled as the primary font, with Asap available for Latin text.

Technology:

- React and TypeScript with Vite
- Material UI for the design system
- React Router with hash routing for GitHub Pages compatibility
- TanStack React Query for asynchronous repository/server state
- Zustand for the temporary, unsaved capture set
- Axios reserved for future HTTP calls
- IndexedDB for local binary storage

The source of configurable limits is `src/config/app.config.ts`.
