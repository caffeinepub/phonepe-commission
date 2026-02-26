# Specification

## Summary
**Goal:** Add a Customer Photos Gallery feature to the PhonePe Commission Tracker app, allowing users to upload, view, and delete customer photos stored within the canister.

**Planned changes:**
- Add a stable backend data model in `backend/main.mo` to store customer photo entries (unique ID, name/label, Base64 image data, upload timestamp)
- Add backend functions: `addCustomerPhoto`, `getCustomerPhotos`, and `deleteCustomerPhoto`
- Add a "Customer Photos" tab/button in the app header navigation alongside the existing commission dashboard
- Create a Customer Photos Gallery page with a responsive grid layout showing saved photos with name labels
- Add an "Upload Photo" dialog with a name input and image file picker
- Add a delete button on each photo card with a confirmation prompt before removal
- Show an empty state message when no photos exist
- Add `useCustomerPhotos`, `useAddCustomerPhoto`, and `useDeleteCustomerPhoto` React Query hooks in `frontend/src/hooks/useQueries.ts`
- Show toast notifications on upload/delete success and failure

**User-visible outcome:** Users can navigate to a Customer Photos Gallery tab, upload customer photos with name labels, view them in a grid, and delete them — all stored persistently within the canister and styled consistently with the existing PhonePe-inspired theme.
