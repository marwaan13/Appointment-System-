import express from "express";
import {
  createPatient,
  listPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} from "../controllers/patient.controller"; // Adjust the path if needed

const router = express.Router();

router.post("/", createPatient);
router.get("/", listPatients);
router.get("/:id", getPatientById);
router.put("/:id", updatePatient);
router.delete("/:id", deletePatient);

export default router;
