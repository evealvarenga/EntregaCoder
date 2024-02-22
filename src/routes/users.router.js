import { Router } from "express";
import { findUserById, updateUser, userDocuments} from "../controllers/users.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();
 
router.get("/:idUser", findUserById)
router.get("/premium/:idUser",authMiddleware(["USER", "PREMIUM"]) , async (req, res) => {
    const { _id, email } = req.params;
    const { role } = req.body;
    await updateUser(_id, email, role)
    res.redirect("/api/views/profile")
})
router.post("/:id/documents", upload.fields([
    {name:'DNI', maxCount:1},
    {name:'address', maxCount:1},
    {name:'bank', maxCount:1}
]), userDocuments
)

export default router;