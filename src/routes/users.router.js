import { Router } from "express";
import { findUserById, findUserByEmail, createUser } from "../controllers/users.controller.js";

const router = Router();

router.get("/:idUser", findUserById)

export default router;