# Specification

## Summary
**Goal:** Fix the "Not Found" routing error on the deployed application so users land on the home page correctly.

**Planned changes:**
- Fix TanStack Router configuration to correctly handle the root route and all defined routes (home, about, event-details, registration, gallery, check-registration, admin, admin/dashboard)
- Add a proper catch-all/fallback route to show a user-friendly 404 page for unknown paths
- Ensure frontend build configuration and asset paths support client-side routing in the Internet Computer deployment environment so page refreshes and direct URL navigation work correctly

**User-visible outcome:** Users can navigate to the deployed app without seeing a "Not Found" error; the home page loads at the root URL, all routes resolve correctly, and page refreshes on any valid route work as expected.
