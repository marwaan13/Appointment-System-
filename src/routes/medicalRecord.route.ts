import { Router } from "express";
import {
  createMedicalRecord,
  listMedicalRecords,
  getMedicalRecordById,
  updateMedicalRecord,
  deleteMedicalRecord,
} from "../controllers/medicalRecord.controller";

import { authenticate, authorize } from "../helpers/auth";

const router = Router();

// Medical records routes with authentication & authorization
router.post("/register", authenticate, authorize(["ADMIN", "DOCTOR", "PATIENT"]), createMedicalRecord);

router.get("/list", authenticate, authorize(["ADMIN", "DOCTOR", "PATIENT"]), listMedicalRecords);

router.get("/:id", authenticate, authorize(["ADMIN", "DOCTOR", "PATIENT"]), getMedicalRecordById);

router.put("/update/:id", authenticate, authorize(["ADMIN", "DOCTOR"]), updateMedicalRecord);

router.delete("/delete/:id", authenticate, authorize(["ADMIN"]), deleteMedicalRecord);

export default router;
