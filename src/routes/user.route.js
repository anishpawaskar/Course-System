import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { deleteUserAccount } from "../controllers/teacher.controller.js";

const router = Router();

router.delete("/", verifyJWT, deleteUserAccount);

export default router;
