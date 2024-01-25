import { Router } from "express";
import { findUserById, updateUser} from "../controllers/users.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();
 
router.get("/:idUser", findUserById)
router.get("/premium/:idUser",authMiddleware(["USER", "PREMIUM"]) , updateUser)

export default router;