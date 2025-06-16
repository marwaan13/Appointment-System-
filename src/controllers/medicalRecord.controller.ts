import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create Medical Record
export const createMedicalRecord = async (req: Request, res: Response): Promise<void> => {
  try {
    const { patientId, title, description, recordDate } = req.body;

    if (!patientId || !title || !description || !recordDate) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const medicalRecord = await prisma.medicalRecord.create({
      data: {
        patientId,
        title,
        description,
        recordDate: new Date(recordDate),
      },
    });

    res.status(201).json({
      message: "Medical record created successfully",
      result: medicalRecord,
    });
  } catch (error) {
    console.error("Error creating medical record:", error);
    res.status(500).json({ message: "Failed to create medical record" });
  }
};

// List all Medical Records
export const listMedicalRecords = async (req: Request, res: Response): Promise<void> => {
  try {
    const records = await prisma.medicalRecord.findMany({
      include: { patient: { select: { id: true, userId: true } } },
      orderBy: { recordDate: "desc" },
    });

    res.status(200).json({
      message: "Success",
      result: records,
    });
  } catch (error) {
    console.error("Error listing medical records:", error);
    res.status(500).json({ message: "Failed to list medical records" });
  }
};

// Get Medical Record by ID
export const getMedicalRecordById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid medical record ID" });
      return;
    }

    const record = await prisma.medicalRecord.findUnique({
      where: { id },
      include: { patient: true },
    });

    if (!record) {
      res.status(404).json({ message: "Medical record not found" });
      return;
    }

    res.status(200).json({ message: "Success", result: record });
  } catch (error) {
    console.error("Error fetching medical record:", error);
    res.status(500).json({ message: "Failed to fetch medical record" });
  }
};

// Update Medical Record
export const updateMedicalRecord = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const { title, description, recordDate } = req.body;

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid medical record ID" });
      return;
    }

    const existing = await prisma.medicalRecord.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ message: "Medical record not found" });
      return;
    }

    const updated = await prisma.medicalRecord.update({
      where: { id },
      data: {
        title: title ?? existing.title,
        description: description ?? existing.description,
        recordDate: recordDate ? new Date(recordDate) : existing.recordDate,
      },
    });

    res.status(200).json({ message: "Medical record updated", result: updated });
  } catch (error) {
    console.error("Error updating medical record:", error);
    res.status(500).json({ message: "Failed to update medical record" });
  }
};

// Delete Medical Record (soft delete if you want, or hard delete)
export const deleteMedicalRecord = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid medical record ID" });
      return;
    }

    // Hard delete:
    await prisma.medicalRecord.delete({ where: { id } });

    res.status(200).json({ message: "Medical record deleted" });
  } catch (error) {
    console.error("Error deleting medical record:", error);
    res.status(500).json({ message: "Failed to delete medical record" });
  }
};
