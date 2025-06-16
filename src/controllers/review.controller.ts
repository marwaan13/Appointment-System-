import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create Review
export const createReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { patientId, doctorId, rating, comment } = req.body;

    if (!patientId || !doctorId || !rating) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    if (rating < 1 || rating > 5) {
      res.status(400).json({ message: "Rating must be between 1 and 5" });
      return;
    }

    const review = await prisma.review.create({
      data: {
        patientId,
        doctorId,
        rating,
        comment,
      },
    });

    res.status(201).json({
      message: "Review created successfully",
      result: review,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Failed to create review" });
  }
};

// List all Reviews
export const listReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        patient: { select: { id: true, userId: true } },
        doctor: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      message: "Success",
      result: reviews,
    });
  } catch (error) {
    console.error("Error listing reviews:", error);
    res.status(500).json({ message: "Failed to list reviews" });
  }
};

// Get Review by ID
export const getReviewById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid review ID" });
      return;
    }

    const review = await prisma.review.findUnique({
      where: { id },
      include: { patient: true, doctor: true },
    });

    if (!review) {
      res.status(404).json({ message: "Review not found" });
      return;
    }

    res.status(200).json({ message: "Success", result: review });
  } catch (error) {
    console.error("Error fetching review:", error);
    res.status(500).json({ message: "Failed to fetch review" });
  }
};

// Update Review
export const updateReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const { rating, comment } = req.body;

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid review ID" });
      return;
    }

    const existing = await prisma.review.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ message: "Review not found" });
      return;
    }

    const updated = await prisma.review.update({
      where: { id },
      data: {
        rating: rating ?? existing.rating,
        comment: comment ?? existing.comment,
      },
    });

    res.status(200).json({ message: "Review updated", result: updated });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ message: "Failed to update review" });
  }
};

// Delete Review (hard delete)
export const deleteReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid review ID" });
      return;
    }

    await prisma.review.delete({ where: { id } });

    res.status(200).json({ message: "Review deleted" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Failed to delete review" });
  }
};
