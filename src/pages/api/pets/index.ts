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

      // Safely parse query parameters
      if (req.query.status && typeof req.query.status === "string") {
        filters.status = req.query.status as any;
      }

      if (req.query.type && typeof req.query.type === "string") {
        filters.type = req.query.type;
      }

      if (req.query.breed && typeof req.query.breed === "string") {
        filters.breed = req.query.breed;
      }

      if (req.query.location && typeof req.query.location === "string") {
        filters.location = req.query.location;
      }

      if (req.query.owner_id && typeof req.query.owner_id === "string") {
        filters.owner_id = req.query.owner_id;
      }

      if (
        req.query.reported_after &&
        typeof req.query.reported_after === "string"
      ) {
        filters.reported_after = req.query.reported_after;
      }

      if (
        req.query.reported_before &&
        typeof req.query.reported_before === "string"
      ) {
        filters.reported_before = req.query.reported_before;
      }

      if (req.query.limit && typeof req.query.limit === "string") {
        const parsedLimit = parseInt(req.query.limit);
        if (!isNaN(parsedLimit) && parsedLimit > 0) {
          filters.limit = parsedLimit;
        }
      }

      if (req.query.offset && typeof req.query.offset === "string") {
        const parsedOffset = parseInt(req.query.offset);
        if (!isNaN(parsedOffset) && parsedOffset >= 0) {
          filters.offset = parsedOffset;
        }
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

      // Validate request body
      if (!req.body || typeof req.body !== "object") {
        return res.status(400).json({ error: "Invalid request body" });
      }

      // Validate required fields
      const { name, type, breed, location, coordinates, status } = req.body;
      if (!name || !type || !breed || !location || !coordinates || !status) {
        return res.status(400).json({
          error: "Missing required fields",
          details:
            "name, type, breed, location, coordinates, and status are required",
        });
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

    // Handle common errors with appropriate status codes
    if (error.message?.includes("Authentication required")) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    if (error.message?.includes("Missing required fields")) {
      return res.status(400).json({
        error: error.message || "Missing required fields",
      });
    }

    if (error.message?.includes("permission")) {
      return res.status(403).json({
        error: error.message || "Permission denied",
      });
    }

    return res.status(error.status || 500).json({
      error: error.message || "Internal server error",
      details: error.details || undefined,
    });
  }
}
