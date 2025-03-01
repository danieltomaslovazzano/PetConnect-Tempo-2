export interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string;
  color?: string;
  gender?: string;
  size?: string;
  age?: string;
  description?: string;
  status: "lost" | "found" | "resolved" | "blocked";
  owner_id: string;
  owner_name: string;
  owner_email: string;
  location: string;
  coordinates: { lat: number; lng: number };
  reported_date: string;
  image_url?: string;
  microchipped?: boolean;
  collar?: boolean;
  distinctive_features?: string;
}

export interface CreatePetRequest {
  name: string;
  type: string;
  breed: string;
  color?: string;
  gender?: string;
  size?: string;
  age?: string;
  description?: string;
  status: "lost" | "found";
  owner_name: string;
  owner_email: string;
  location: string;
  coordinates: { lat: number; lng: number };
  image_url?: string;
  microchipped?: boolean;
  collar?: boolean;
  distinctive_features?: string;
}

export interface UpdatePetRequest {
  name?: string;
  type?: string;
  breed?: string;
  color?: string;
  gender?: string;
  size?: string;
  age?: string;
  description?: string;
  status?: "lost" | "found" | "resolved";
  location?: string;
  coordinates?: { lat: number; lng: number };
  image_url?: string;
  microchipped?: boolean;
  collar?: boolean;
  distinctive_features?: string;
}

export interface PetResponse {
  pet: Pet;
  message: string;
}

export interface PetsResponse {
  pets: Pet[];
  count: number;
  message: string;
}

export interface PetError {
  error: string;
  status: number;
  details?: any;
}

export interface PetFilters {
  status?: "lost" | "found" | "resolved" | "blocked";
  type?: string;
  breed?: string;
  location?: string;
  owner_id?: string;
  reported_after?: string;
  reported_before?: string;
  limit?: number;
  offset?: number;
}
