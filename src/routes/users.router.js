import { Router } from "express";
import { findUserById} from "../controllers/users.controller.js";

const router = Router();

router.get("/:idUser", findUserById)

export default router;