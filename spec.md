# Specification

## Summary
**Goal:** Add admin-only edit capability for registrations in the Project Expo 2026 app, allowing the admin to modify any registration's details from the Admin Dashboard.

**Planned changes:**
- Add an `updateRegistration` function to the backend canister that accepts a registration ID and updated field values, protected by admin credential verification
- Add a `useUpdateRegistration` mutation hook in `useQueries.ts` that calls the backend function and invalidates the registrations list query on success
- Add an "Edit" button to each row in the Admin Dashboard registrations table
- Clicking "Edit" opens a modal/drawer pre-filled with the registration's current values, styled with the existing green gradient and glassmorphism design
- Submitting the edit form calls `updateRegistration`, shows a success toast, and refreshes the table; displays an error message on failure

**User-visible outcome:** The admin can click "Edit" on any registration row in the dashboard, update any field in a pre-filled modal, and save the changes — which are immediately reflected in the registrations table.
