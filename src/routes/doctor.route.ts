import { Router } from "express";
import {
  createDoctor,
  listDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} from "../controllers/doctor.controller";
import { authenticate, authorize } from "../helpers/auth";

const router = Router();

// POST /api/doctors
router.post("/register", authenticate, authorize(["ADMIN"]), createDoctor);

// GET /api/doctors
router.get("/list/", authenticate, listDoctors);

// GET /api/doctors/:id
router.get("/:id", authenticate, getDoctorById);

// PUT /api/doctors/:id
router.put("/update/:id", authenticate, authorize(["ADMIN"]), updateDoctor);

// DELETE /api/doctors/:id
router.delete("/delete/:id", authenticate, authorize(["ADMIN"]), deleteDoctor);

export default router;
