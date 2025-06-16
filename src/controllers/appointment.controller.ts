import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create Appointment
export const createAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { patientId, doctorId, date, time, status } = req.body;

    const existing = await prisma.appointment.findFirst({
      where: {
        doctorId,
        date: new Date(date),
        time,
        status: { not: "cancelled" }
      },
    });

    if (existing) {
      res.status(400).json({ message: "This time is already booked with the doctor" });
      return;
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        doctorId,
        date: new Date(date),
        time,
        status: status || "pending"
      },
    });

    res.status(201).json({ message: "Appointment created", result: appointment });

  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ message: "Failed to create appointment" });
  }
};

// List all Appointments
export const listAppointments = async (_req: Request, res: Response): Promise<void> => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true, hospital: true } },
        payment: true
      },
    });

    res.status(200).json({ message: "Success", result: appointments });
  } catch (error) {
    console.error("Error listing appointments:", error);
    res.status(500).json({ message: "Failed to list appointments" });
  }
};

// Get single appointment
export const getAppointmentById = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ message: "Invalid appointment ID" });
    return;
  }

  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true, hospital: true } },
        payment: true
      }
    });

    if (!appointment) {
      res.status(404).json({ message: "Appointment not found" });
      return;
    }

    res.status(200).json({ message: "Success", result: appointment });
  } catch (error) {
    console.error("Error fetching appointment:", error);
    res.status(500).json({ message: "Failed to fetch appointment" });
  }
};

// Update appointment
export const updateAppointment = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  const { date, time, status } = req.body;

  if (isNaN(id)) {
    res.status(400).json({ message: "Invalid appointment ID" });
    return;
  }

  try {
    const existing = await prisma.appointment.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ message: "Appointment not found" });
      return;
    }

    // Optional: Check if new time slot is available
    if (date && time) {
      const conflict = await prisma.appointment.findFirst({
        where: {
          doctorId: existing.doctorId,
          date: new Date(date),
          time,
          id: { not: id },
          status: { not: "cancelled" }
        },
      });

      if (conflict) {
        res.status(400).json({ message: "This new time is already booked" });
        return;
      }
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        date: date ? new Date(date) : undefined,
        time,
        status,
      },
    });

    res.status(200).json({ message: "Appointment updated", result: updated });
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({ message: "Failed to update appointment" });
  }
};

// Delete appointment
export const deleteAppointment = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ message: "Invalid appointment ID" });
    return;
  }

  try {
    await prisma.appointment.delete({ where: { id } });
    res.status(200).json({ message: "Appointment deleted" });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({ message: "Failed to delete appointment" });
  }
};
