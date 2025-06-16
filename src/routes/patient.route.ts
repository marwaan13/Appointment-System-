import express from "express";
import {
  createPatient,
  listPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} from "../controllers/patient.controller"; // Adjust the path if needed

const router = express.Router();

router.post("/register", createPatient);
router.get("/list", listPatients);
router.get("/:id", getPatientById);
router.put("/update/:id", updatePatient);
router.delete("/delete/:id", deletePatient);

export default router;
