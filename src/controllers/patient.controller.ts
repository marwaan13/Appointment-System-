import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create new patient
export const createPatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, dateOfBirth, gender, phone, address } = req.body;

    const patient = await prisma.patient.create({
      data: {
        userId,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        phone,
        address,
      },
    });

    res.status(201).json({
      message: "Patient created successfully",
      result: patient,
    });
  } catch (error) {
    console.error("Error creating patient:", error);
    res.status(500).json({ message: "Failed to create patient" });
  }
};

// List all patients
export const listPatients = async (_req: Request, res: Response): Promise<void> => {
  try {
    const patients = await prisma.patient.findMany({
      where: { isDeleted: false },
      include: { user: true },
    });

    res.status(200).json({
      message: "Success",
      result: patients,
    });
  } catch (error) {
    console.error("Error listing patients:", error);
    res.status(500).json({ message: "Failed to list patients" });
  }
};

// Get single patient
export const getPatientById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);

    const patient = await prisma.patient.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!patient || patient.isDeleted) {
       res.status(404).json({ message: "Patient not found" });
    }
    return;

    res.status(200).json({ message: "Success", result: patient });
  } catch (error) {
    console.error("Error fetching patient:", error);
    res.status(500).json({ message: "Failed to fetch patient" });
  }
};

// Update patient
export const updatePatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const { dateOfBirth, gender, phone, address } = req.body;

    const updated = await prisma.patient.update({
      where: { id },
      data: {
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        gender,
        phone,
        address,
      },
    });

    res.status(200).json({ message: "Patient updated", result: updated });
  } catch (error) {
    console.error("Error updating patient:", error);
    res.status(500).json({ message: "Failed to update patient" });
  }
};

// Soft delete patient
export const deletePatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);

    await prisma.patient.update({
      where: { id },
      data: { isDeleted: true },
    });

    res.status(200).json({ message: "Patient deleted" });
  } catch (error) {
    console.error("Error deleting patient:", error);
    res.status(500).json({ message: "Failed to delete patient" });
  }
};
