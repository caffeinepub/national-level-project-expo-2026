# Specification

## Summary
**Goal:** Update the admin dashboard host email to `athiakash1977@gmail.com` for the National Project Expo 2026 application.

**Planned changes:**
- Update the hardcoded admin email in the backend to `athiakash1977@gmail.com` so it is used as the primary credential for admin authentication
- Update the frontend AdminLogin page to validate login against `athiakash1977@gmail.com`, rejecting any other email

**User-visible outcome:** Logging into the admin dashboard with `athiakash1977@gmail.com` and the correct password grants access, while any other email is rejected.
