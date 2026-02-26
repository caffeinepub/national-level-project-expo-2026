# Specification

## Summary
**Goal:** Activate and fully wire up the admin management system for the single authorized admin email `athiakash1977@gmail.com`, enabling content editing and registered teams visibility.

**Planned changes:**
- Set `athiakash1977@gmail.com` as the sole authorized admin credential in both backend authorization logic and the frontend AdminLogin page; pre-populate the email field and reject all other emails.
- Ensure the Admin Dashboard's Content Management tab (Hero, About, Event Details, Coordinators, Contact sections) loads current backend data and saves edits successfully.
- Ensure the Admin Dashboard's Registrations tab fetches and displays all registered teams/participants with full details (name, team name, email, category, registration ID, timestamp), including real-time search/filter and a CSV export button.
- Add an analytics summary card at the top of the Admin Dashboard showing the total registered teams count fetched live from the backend.
- Ensure the ProtectedRoute guard redirects unauthenticated visitors away from all `/admin` routes to the AdminLogin page, and redirects back to the dashboard after successful login.

**User-visible outcome:** The admin can log in exclusively with `athiakash1977@gmail.com`, edit all site content from the dashboard, view and search all registered teams, export registrations as CSV, and see a live total registration count — while unauthenticated users are always redirected to the login page.
