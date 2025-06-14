import { Router } from "express";
import { changeRole, createUser, deleteUser, listUsers, login, me, updateUser } from "../controllers/user.controller";
import { authenticate, authorize } from "../helpers/auth";

const router = Router();


// get / api/user/me
router.get("/me", authenticate , me)

// get /api/user/change-role
router.get("/list" , listUsers)

// post/user/createuser
router.post("/register", createUser);

// post /api/user/register
router.post("/login", login);

// post /api/user/login
router.put("/change-role",authenticate,authorize(["ADMIN"]), changeRole);

// PUT /API/USER/ID/UPDATEUSER
router.put("/:id", updateUser);

// delete /api/id/deleteuser
router.delete("/:id", deleteUser);


export default router;
