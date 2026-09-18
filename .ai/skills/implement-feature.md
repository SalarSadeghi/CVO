# Skill: implement a frontend feature

Use this checklist for a feature-sized change.

1. Read the project context and applicable rules in this directory.
2. Inspect the route, feature, storage/API boundary, domain types, and existing tests involved.
3. State the user flow and identify loading, empty, error, success, and destructive states.
4. Add or update domain types before UI code.
5. Put reusable behavior in a focused hook, utility, component, repository, or feature module.
6. Compose the behavior in a page; avoid embedding persistence or HTTP details in the page.
7. Add tests for pure rules and data mapping.
8. Test keyboard and mobile behavior, object URL cleanup, and persistence after refresh where relevant.
9. Run type checking, tests, and a production build.
10. Update the README and project context when architecture or product behavior changes.
