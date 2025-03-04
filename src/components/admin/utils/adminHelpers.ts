// src/components/admin/utils/adminHelpers.ts

// Devuelve una variante (estilo) basado en el estado
export function getStatusVariant(status: string): string {
  switch (status) {
    case "lost":
      return "destructive";
    case "found":
      return "outline";
    case "blocked":
      return "secondary";
    default:
      return "default";
  }
}

// Genera una URL de avatar basándose en las iniciales del nombre
export function generateAvatarUrl(name: string): string {
  const initials = getInitials(name);
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}`;
}

// Obtiene las iniciales de un nombre
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map(n => n[0])
    .join("");
}