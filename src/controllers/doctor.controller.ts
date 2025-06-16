import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create doctor
export const createDoctor = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      userId,
      name,
      phone,
      experience,
      specialization,
      availability,
      timeAvailable,
      hospitalId,
    } = req.body;

    if (!userId || !name || !phone || !experience || !specialization || !availability || !timeAvailable) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const doctor = await prisma.doctor.create({
      data: {
        userId,
        name,
        phone,
        experience,
        specialization,
        availability,
        timeAvailable,
        hospitalId,
      },
    });

    res.status(201).json({ message: "Doctor created successfully", result: doctor });
  } catch (error) {
    console.error("Error creating doctor:", error);
    res.status(500).json({ message: "Failed to create doctor" });
  }
};

// List all doctors
export const listDoctors = async (_req: Request, res: Response): Promise<void> => {
  try {
    const doctors = await prisma.doctor.findMany({
      where: { isDeleted: false },
      include: {
        user: {
          select: { firstname: true, lastname: true },
        },
        hospital: true,
      },
    });

    res.status(200).json({
      message: "Success",
      result: doctors.map((d) => ({
        ...d,
        fullName: d.user ? `${d.user.firstname} ${d.user.lastname}` : null,
      })),
    });
  } catch (error) {
    console.error("Error listing doctors:", error);
    res.status(500).json({ message: "Failed to list doctors" });
  }
};

// Get single doctor
export const getDoctorById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid doctor ID" });
      return;
    }

    const doctor = await prisma.doctor.findUnique({
      where: { id },
      include: {
        user: {
          select: { firstname: true, lastname: true },
        },
        hospital: true,
      },
    });

    if (!doctor || doctor.isDeleted) {
      res.status(404).json({ message: "Doctor not found" });
      return;
    }

    res.status(200).json({
      message: "Success",
      result: {
        ...doctor,
        fullName: doctor.user ? `${doctor.user.firstname} ${doctor.user.lastname}` : null,
      },
    });
  } catch (error) {
    console.error("Error fetching doctor:", error);
    res.status(500).json({ message: "Failed to fetch doctor" });
  }
};

// Update doctor
export const updateDoctor = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const {
      name,
      phone,
      experience,
      specialization,
      availability,
      timeAvailable,
      hospitalId,
    } = req.body;

    const existing = await prisma.doctor.findUnique({ where: { id } });
    if (!existing || existing.isDeleted) {
      res.status(404).json({ message: "Doctor not found" });
      return;
    }

    const updated = await prisma.doctor.update({
      where: { id },
      data: {
        name,
        phone,
        experience,
        specialization,
        availability,
        timeAvailable,
        hospitalId,
      },
    });

    res.status(200).json({ message: "Doctor updated", result: updated });
  } catch (error) {
    console.error("Error updating doctor:", error);
    res.status(500).json({ message: "Failed to update doctor" });
  }
};

// Soft delete doctor
export const deleteDoctor = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const existing = await prisma.doctor.findUnique({ where: { id } });
    if (!existing || existing.isDeleted) {
      res.status(404).json({ message: "Doctor not found" });
      return;
    }

    await prisma.doctor.update({
      where: { id },
      data: { isDeleted: true },
    });

    res.status(200).json({ message: "Doctor deleted" });
  } catch (error) {
    console.error("Error deleting doctor:", error);
    res.status(500).json({ message: "Failed to delete doctor" });
  }
};
