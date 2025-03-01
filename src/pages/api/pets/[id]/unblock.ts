import { NextApiRequest, NextApiResponse } from "next";
import { unblockPet } from "@/api/pets/petsService";
import { getCurrentUser, hasRole } from "@/api/auth/authService";

/**
 * Handler for /api/pets/[id]/unblock endpoint
 * POST: Unblock a pet (requires admin/moderator role)
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

    // Only allow POST method
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Check if user has moderator or admin role
    const isModerator = await hasRole("moderator");
    if (!isModerator) {
      return res
        .status(403)
        .json({ error: "You don't have permission to unblock pets" });
    }

    // Get original status from request body
    const { originalStatus = "lost" } = req.body || {};

    // Unblock pet
    const pet = await unblockPet(id, originalStatus);

    return res.status(200).json({
      pet,
      message: "Pet unblocked successfully",
    });
  } catch (error: any) {
    console.error("API error:", error);

    return res.status(error.status || 500).json({
      error: error.message || "Internal server error",
      details: error.details || undefined,
    });
  }
}
