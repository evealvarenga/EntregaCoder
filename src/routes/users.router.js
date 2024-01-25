import { Router } from "express";
import { findUserById, updateUser} from "../controllers/users.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();
 
router.get("/:idUser", findUserById)
router.get("/premium/:idUser",authMiddleware(["USER", "PREMIUM"]) , async (req, res) => {
    const { _id, email } = req.params;
    const { role } = req.body;
    await updateUser(_id, email, role)
    res.redirect("/api/views/profile")
})

export default router;