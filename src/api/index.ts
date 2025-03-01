// Auth exports
export {
  getCurrentUser,
  getAuthToken,
  hasRole,
  isResourceOwner,
} from "./auth/authService";
export type {
  AuthUser,
  AuthToken,
  AuthResponse,
  AuthError,
} from "./auth/types";

// Pets exports
export {
  getPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
  blockPet,
  unblockPet,
} from "./pets/petsService";

export {
  fetchPets,
  fetchPetById,
  createPetApi,
  updatePetApi,
  deletePetApi,
  blockPetApi,
  unblockPetApi,
} from "./pets/petsApi";

export type {
  Pet,
  CreatePetRequest,
  UpdatePetRequest,
  PetResponse,
  PetsResponse,
  PetError,
  PetFilters,
} from "./pets/types";
