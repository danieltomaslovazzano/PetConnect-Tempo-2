import { NextApiRequest, NextApiResponse } from "next";
import { getPets, createPet } from "@/api/pets/petsService";
import { PetFilters } from "@/api/pets/types";
import { getCurrentUser } from "@/api/auth/authService";

/**
 * Handler for /api/pets endpoint
 * GET: Get all pets with optional filtering
 * POST: Create a new pet (requires authentication)
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    // Handle GET request
    if (req.method === "GET") {
      // Parse query parameters
      const filters: PetFilters = {};

      if (req.query.status) {
        filters.status = req.query.status as any;
      }

      if (req.query.type) {
        filters.type = req.query.type as string;
      }

      if (req.query.breed) {
        filters.breed = req.query.breed as string;
      }

      if (req.query.location) {
        filters.location = req.query.location as string;
      }

      if (req.query.owner_id) {
        filters.owner_id = req.query.owner_id as string;
      }

      if (req.query.reported_after) {
        filters.reported_after = req.query.reported_after as string;
      }

      if (req.query.reported_before) {
        filters.reported_before = req.query.reported_before as string;
      }

      if (req.query.limit) {
        filters.limit = parseInt(req.query.limit as string);
      }

      if (req.query.offset) {
        filters.offset = parseInt(req.query.offset as string);
      }

      // Get pets with filters
      const pets = await getPets(filters);

      return res.status(200).json({
        pets,
        count: pets.length,
        message: "Pets retrieved successfully",
      });
    }

    // Handle POST request
    if (req.method === "POST") {
      // Check authentication
      const user = await getCurrentUser();
      if (!user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      // Create pet
      const pet = await createPet(req.body);

      return res.status(201).json({
        pet,
        message: "Pet created successfully",
      });
    }

    // Handle unsupported methods
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    console.error("API error:", error);

    return res.status(error.status || 500).json({
      error: error.message || "Internal server error",
      details: error.details || undefined,
    });
  }
}
