import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create Hospital
export const createHospital = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, address, status, services } = req.body;

    if (!name || !address || !status) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const hospital = await prisma.hospital.create({
      data: {
        name,
        address,
        status,
        services,
      },
    });

    res.status(201).json({ message: "Hospital created", result: hospital });
  } catch (error) {
    console.error("Error creating hospital:", error);
    res.status(500).json({ message: "Failed to create hospital" });
  }
};

// List all hospitals
export const listHospitals = async (_req: Request, res: Response): Promise<void> => {
  try {
    const hospitals = await prisma.hospital.findMany({
      include: {
        doctors: {
          select: {
            id: true,
            name: true,
            specialization: true,
          },
        },
      },
    });

    res.status(200).json({ message: "Success", result: hospitals });
  } catch (error) {
    console.error("Error listing hospitals:", error);
    res.status(500).json({ message: "Failed to list hospitals" });
  }
};

// Get hospital by ID
export const getHospitalById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid hospital ID" });
      return;
    }

    const hospital = await prisma.hospital.findUnique({
      where: { id },
      include: {
        doctors: true,
      },
    });

    if (!hospital) {
      res.status(404).json({ message: "Hospital not found" });
      return;
    }

    res.status(200).json({ message: "Success", result: hospital });
  } catch (error) {
    console.error("Error getting hospital:", error);
    res.status(500).json({ message: "Failed to get hospital" });
  }
};

// Update hospital
export const updateHospital = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const { name, address, status, services } = req.body;

    const existing = await prisma.hospital.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ message: "Hospital not found" });
      return;
    }

    const updated = await prisma.hospital.update({
      where: { id },
      data: { name, address, status, services },
    });

    res.status(200).json({ message: "Hospital updated", result: updated });
  } catch (error) {
    console.error("Error updating hospital:", error);
    res.status(500).json({ message: "Failed to update hospital" });
  }
};

// Delete hospital (hard delete)
export const deleteHospital = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);

    const existing = await prisma.hospital.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ message: "Hospital not found" });
      return;
    }

    await prisma.hospital.delete({ where: { id } });

    res.status(200).json({ message: "Hospital deleted" });
  } catch (error) {
    console.error("Error deleting hospital:", error);
    res.status(500).json({ message: "Failed to delete hospital" });
  }
};
