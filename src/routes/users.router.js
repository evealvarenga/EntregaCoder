import { Router } from "express";
import { findUserById, updateUser, userDocuments, deleteInactiveUsers } from "../controllers/users.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router.get("/:idUser", findUserById)
router.post("/premium/:idUser", updateUser)

router.post("/:id/documents", upload.fields([
    { name: 'DNI', maxCount: 1 },
    { name: 'address', maxCount: 1 },
    { name: 'bank', maxCount: 1 }
]), userDocuments
)

router.delete("/deleteInactiveUsers", deleteInactiveUsers)

export default router; 