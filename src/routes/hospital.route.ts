import { Router } from "express";
import {
  createHospital,
  listHospitals,
  getHospitalById,
  updateHospital,
  deleteHospital,
} from "../controllers/hospital.controller";
import { authenticate, authorize } from "../helpers/auth";

const router = Router();

// POST /api/hospitals
router.post("/register", authenticate, authorize(["ADMIN"]), createHospital);

// GET /api/hospitals
router.get("/list/", authenticate, listHospitals);

// GET /api/hospitals/:id
router.get("/:id", authenticate, getHospitalById);

// PUT /api/hospitals/:id
router.put("/update/:id", authenticate, authorize(["ADMIN"]), updateHospital);

// DELETE /api/hospitals/:id
router.delete("/delete/:id", authenticate, authorize(["ADMIN"]), deleteHospital);

export default router;
