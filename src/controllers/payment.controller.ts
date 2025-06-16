import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create Payment
export const createPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { appointmentId, amount, method, status, paidAt } = req.body;

    // Ensure appointment exists
    const appointment = await prisma.appointment.findUnique({ where: { id: appointmentId } });
    if (!appointment) {
      res.status(404).json({ message: "Appointment not found" });
      return;
    }

    // Ensure no duplicate payment
    const existing = await prisma.payment.findUnique({ where: { appointmentId } });
    if (existing) {
      res.status(400).json({ message: "Payment already exists for this appointment" });
      return;
    }

    const payment = await prisma.payment.create({
      data: {
        appointmentId,
        amount,
        method,
        status,
        paidAt: paidAt ? new Date(paidAt) : undefined
      }
    });

    res.status(201).json({ message: "Payment created", result: payment });

  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({ message: "Failed to create payment" });
  }
};

// List all Payments
export const listPayments = async (_req: Request, res: Response): Promise<void> => {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        appointment: {
          include: {
            patient: { include: { user: true } },
            doctor: { include: { user: true } }
          }
        }
      }
    });

    res.status(200).json({ message: "Success", result: payments });
  } catch (error) {
    console.error("Error listing payments:", error);
    res.status(500).json({ message: "Failed to list payments" });
  }
};

// Get Payment by ID
export const getPaymentById = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ message: "Invalid payment ID" });
    return;
  }

  try {
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        appointment: {
          include: {
            patient: { include: { user: true } },
            doctor: { include: { user: true } }
          }
        }
      }
    });

    if (!payment) {
      res.status(404).json({ message: "Payment not found" });
      return;
    }

    res.status(200).json({ message: "Success", result: payment });
  } catch (error) {
    console.error("Error fetching payment:", error);
    res.status(500).json({ message: "Failed to fetch payment" });
  }
};

// Update Payment (e.g., mark as paid)
export const updatePayment = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  const { amount, method, status, paidAt } = req.body;

  if (isNaN(id)) {
    res.status(400).json({ message: "Invalid payment ID" });
    return;
  }

  try {
    const payment = await prisma.payment.update({
      where: { id },
      data: {
        amount,
        method,
        status,
        paidAt: paidAt ? new Date(paidAt) : undefined
      }
    });

    res.status(200).json({ message: "Payment updated", result: payment });
  } catch (error) {
    console.error("Error updating payment:", error);
    res.status(500).json({ message: "Failed to update payment" });
  }
};

// Delete Payment
export const deletePayment = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ message: "Invalid payment ID" });
    return;
  }

  try {
    await prisma.payment.delete({ where: { id } });
    res.status(200).json({ message: "Payment deleted" });
  } catch (error) {
    console.error("Error deleting payment:", error);
    res.status(500).json({ message: "Failed to delete payment" });
  }
};
