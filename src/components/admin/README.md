# Admin Module

This module contains all the components, hooks, and utilities for the admin interface of the PetConnect application.

## Structure

- **context/**: Contains the context and provider for admin state management
  - `AdminContext.tsx`: Defines the context and useAdmin hook
  - `AdminProvider.tsx`: Provides the admin context to components
  - `index.ts`: Exports from the context folder

- **hooks/**: Custom hooks for admin functionality
  - `useAdminUsers.ts`: Hook for user management
  - `useAdminPets.ts`: Hook for pet management

- **types/**: TypeScript types used across the admin module
  - `index.ts`: Common types for admin components

- **utils/**: Utility functions for admin components
  - `adminHelpers.ts`: Helper functions for formatting, display, etc.

- **components/**: Admin UI components
  - `AdminLayout.tsx`: Main layout for admin pages
  - `AdminHeader.tsx`: Header component for admin pages
  - `AdminSidebar.tsx`: Sidebar navigation for admin pages
  - `Dashboard.tsx`: Admin dashboard component
  - `users/`: User management components
  - `pets/`: Pet management components

## Usage

To use the admin functionality in a component:

```tsx
import { useAdmin } from '@/components/admin/context';

function AdminComponent() {
  const { users, loadingUsers, loadUsers } = useAdmin();
  
  // Use admin functionality here
  
  return (
    // Component JSX
  );
}
```

To provide the admin context:

```tsx
import { AdminProvider } from '@/components/admin/context';

function App() {
  return (
    <AdminProvider>
      {/* Admin components */}
    </AdminProvider>
  );
}
```
