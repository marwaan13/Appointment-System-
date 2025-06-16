import { Router } from "express";
import {
  createPayment,
  listPayments,
  getPaymentById,
  updatePayment,
  deletePayment
} from "../controllers/payment.controller";

import { authenticate, authorize } from "../helpers/auth";

const router = Router();

// You can customize roles: ADMIN, ACCOUNTANT, etc.
router.post("/register", authenticate, authorize(["ADMIN"]), createPayment);
router.get("/list", authenticate, authorize(["ADMIN"]), listPayments);
router.get("/:id", authenticate, authorize(["ADMIN"]), getPaymentById);
router.put("/update/:id", authenticate, authorize(["ADMIN"]), updatePayment);
router.delete("/delete/:id", authenticate, authorize(["ADMIN"]), deletePayment);

export default router;
