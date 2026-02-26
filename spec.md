# Specification

## Summary
**Goal:** Fix the admin login so that the correct credentials are accepted without error.

**Planned changes:**
- Update the hardcoded password in `backend/main.mo` `verifyAdminCredentials` to exactly `Akash@8667099605` for email `athiakash1977@gmail.com`, keeping admin name `Akash A`
- Update `frontend/src/pages/AdminLogin.tsx` to submit the password exactly as typed (no trimming/transformation) and set the email field placeholder/pre-fill to `athiakash1977@gmail.com`

**User-visible outcome:** The admin can log in using email `athiakash1977@gmail.com` and password `Akash@8667099605` and be redirected to the admin dashboard, while incorrect passwords still show an error message.
