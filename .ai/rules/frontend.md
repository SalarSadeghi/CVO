# Frontend implementation rules

- TypeScript strict mode must remain enabled. Do not introduce `any` to bypass a type problem.
- Use the Material UI theme and components; do not add a parallel styling system.
- Build mobile-first. Camera controls, dialogs, and navigation must remain usable on narrow screens.
- Keep all user-facing interface copy in Persian and preserve global right-to-left direction.
- Keep camera capture and device file selection as separate actions. Camera access must use `getUserMedia`, stop media tracks when closed, and never silently fall back to a gallery picker.
- Every interactive control needs a clear accessible name and keyboard behavior.
- Always represent loading, empty, success, and error states where applicable.
- Validate files before creating previews. Enforce type, size, duplicate, and configured count limits.
- Revoke every object URL when it is no longer needed.
- Destructive actions require a confirmation dialog.
- User-facing copy must not claim data was sent while no API exists.
- Routes must keep working on GitHub Pages; retain `HashRouter` unless deployment architecture changes.
- Before finishing, run `npm run check`, `npm test`, and `npm run build`.
- Update tests and documentation when behavior or configuration changes.
