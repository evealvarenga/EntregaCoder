import { Router } from "express";
import { findAllUser, findUserById, updateUser, userDocuments, deleteInactiveUsers, deleteUser } from "../controllers/users.controller.js";
import { tokenValidation } from "../middlewares/jwt.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router.get("/",tokenValidation, findAllUser)
router.get("/:idUser", findUserById)
router.post("/premium/:idUser", updateUser)
router.post("/:id/documents", upload.fields([
    { name: 'DNI', maxCount: 1 },
    { name: 'address', maxCount: 1 },
    { name: 'bank', maxCount: 1 }
]), userDocuments
); 
router.post("/delete/:idUser", deleteUser)
router.post("/deleteInactiveUsers", deleteInactiveUsers)

export default router; 