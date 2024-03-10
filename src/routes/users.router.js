import { Router } from "express";
import { findUserById, updateUser, userDocuments, deleteInactiveUsers, updateAdmin } from "../controllers/users.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router.get("/:idUser", findUserById)
router.post("/premium/:idUser", updateUser, (req, res) => { res.redirect("/api/views/profile") })

router.post("/:id/documents", upload.fields([
    { name: 'DNI', maxCount: 1 },
    { name: 'address', maxCount: 1 },
    { name: 'bank', maxCount: 1 }
]), userDocuments
)
router.put("/admin/:userID", updateAdmin)
export default router; 