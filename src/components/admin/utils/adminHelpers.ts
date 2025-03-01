/**
 * Helper functions for the admin interface
 */

// Format date for display
export function formatDate(dateString: string): string {
  if (!dateString) return "";

  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Get status badge variant based on status string
export function getStatusVariant(status: string): string {
  switch (status) {
    case "active":
      return "success";
    case "blocked":
      return "destructive";
    case "pending":
      return "warning";
    case "lost":
      return "destructive";
    case "found":
      return "secondary";
    case "resolved":
      return "success";
    default:
      return "default";
  }
}

// Generate avatar URL from name
export function generateAvatarUrl(name: string): string {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
}

// Get initials from name
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
}
