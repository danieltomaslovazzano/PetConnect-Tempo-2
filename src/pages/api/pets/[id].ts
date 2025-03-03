import { NextApiRequest, NextApiResponse } from "next";
import { getPetById, updatePet, deletePet } from "@/api/pets/petsService";
import {
  getCurrentUser,
  isResourceOwner,
  hasRole,
} from "@/api/auth/authService";

/**
 * Handler for /api/pets/[id] endpoint
 * GET: Get a pet by ID
 * PUT: Update a pet (requires authentication and ownership or admin/moderator role)
 * DELETE: Delete a pet (requires authentication and ownership or admin role)
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { id } = req.query;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ error: "Invalid pet ID" });
    }

    // Handle GET request
    if (req.method === "GET") {
      const pet = await getPetById(id);

      return res.status(200).json({
        pet,
        message: "Pet retrieved successfully",
      });
    }

    // Handle PUT request
    if (req.method === "PUT") {
      // Check authentication
      const user = await getCurrentUser();
      if (!user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      // Check if user is owner or has admin/moderator role
      const isOwner = await isResourceOwner("pets", id);
      const isModerator = await hasRole("moderator");

      if (!isOwner && !isModerator) {
        return res
          .status(403)
          .json({ error: "You don't have permission to update this pet" });
      }

      // Validate request body
      if (!req.body || typeof req.body !== "object") {
        return res.status(400).json({ error: "Invalid request body" });
      }

      // Update pet
      try {
        const pet = await updatePet(id, req.body);
        return res.status(200).json({
          pet,
          message: "Pet updated successfully",
        });
      } catch (err: any) {
        if (err.message?.includes("not found")) {
          return res.status(404).json({ error: `Pet with ID ${id} not found` });
        }
        throw err;
      }
    }

    // Handle DELETE request
    if (req.method === "DELETE") {
      // Check authentication
      const user = await getCurrentUser();
      if (!user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      // Check if user is owner or has admin role
      const isOwner = await isResourceOwner("pets", id);
      const isAdmin = await hasRole("admin");

      if (!isOwner && !isAdmin) {
        return res
          .status(403)
          .json({ error: "You don't have permission to delete this pet" });
      }

      // Delete pet
      try {
        await deletePet(id);
        return res.status(200).json({
          success: true,
          message: "Pet deleted successfully",
        });
      } catch (err: any) {
        if (err.message?.includes("not found")) {
          return res.status(404).json({ error: `Pet with ID ${id} not found` });
        }
        throw err;
      }
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

    if (error.message?.includes("permission")) {
      return res.status(403).json({
        error: error.message || "Permission denied",
      });
    }

    if (error.message?.includes("not found")) {
      return res.status(404).json({
        error: error.message || "Resource not found",
      });
    }

    return res.status(error.status || 500).json({
      error: error.message || "Internal server error",
      details: error.details || undefined,
    });
  }
}
