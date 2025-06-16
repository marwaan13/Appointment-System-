import { Router } from "express";
import {
  createAppointment,
  listAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment
} from "../controllers/appointment.controller";

import { authenticate, authorize } from "../helpers/auth";

const router = Router();

// You can add `authorize(["ADMIN", "DOCTOR"])` based on role permissions
router.post("/register", authenticate, createAppointment);
router.get("/list", authenticate, listAppointments);
router.get("/:id", authenticate, getAppointmentById);
router.put("/:id", authenticate, updateAppointment);
router.delete("/:id", authenticate, authorize(["ADMIN"]), deleteAppointment);

export default router;
