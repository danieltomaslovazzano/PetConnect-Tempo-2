import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CreatePetRequest, UpdatePetRequest } from "@/api";
import { usePets } from "@/hooks";

// Schema for pet form validation
const petFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  type: z.string().min(1, { message: "Type is required" }),
  breed: z.string().min(1, { message: "Breed is required" }),
  color: z.string().optional(),
  gender: z.enum(["male", "female", "unknown"]).optional(),
  size: z.enum(["small", "medium", "large", "xlarge"]).optional(),
  age: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["lost", "found"]),
  location: z.string().min(1, { message: "Location is required" }),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  image_url: z.string().url().optional(),
  microchipped: z.boolean().optional(),
  collar: z.boolean().optional(),
  distinctive_features: z.string().optional(),
});

type PetFormValues = z.infer<typeof petFormSchema>;

/**
 * Hook for managing pet form state and submission
 */
export function usePetForm(
  petId?: string,
  initialData?: Partial<PetFormValues>,
) {
  const { createPet, updatePet, getPet } = usePets();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Initialize form with default values or initial data
  const form = useForm<PetFormValues>({
    resolver: zodResolver(petFormSchema),
    defaultValues: {
      name: "",
      type: "Dog",
      breed: "",
      status: "lost",
      location: "",
      coordinates: { lat: 0, lng: 0 },
      ...initialData,
    },
  });

  // Load pet data if editing an existing pet
  const loadPetData = async () => {
    if (!petId) return;

    try {
      setLoading(true);
      setError(null);

      const pet = await getPet(petId);

      // Reset form with pet data
      form.reset({
        name: pet.name,
        type: pet.type,
        breed: pet.breed,
        color: pet.color,
        gender: pet.gender as any,
        size: pet.size as any,
        age: pet.age,
        description: pet.description,
        status: pet.status as "lost" | "found",
        location: pet.location,
        coordinates: pet.coordinates,
        image_url: pet.image_url,
        microchipped: pet.microchipped,
        collar: pet.collar,
        distinctive_features: pet.distinctive_features,
      });

      return pet;
    } catch (err: any) {
      console.error(`Error loading pet with ID ${petId}:`, err);
      setError(err.error || "Failed to load pet data");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Submit form data
  const onSubmit = async (data: PetFormValues) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      if (petId) {
        // Update existing pet
        await updatePet(petId, data as UpdatePetRequest);
      } else {
        // Create new pet
        await createPet(data as CreatePetRequest);
      }

      setSuccess(true);
      return true;
    } catch (err: any) {
      console.error("Error submitting pet form:", err);
      setError(err.error || "Failed to save pet");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    error,
    success,
    loadPetData,
    onSubmit,
  };
}
