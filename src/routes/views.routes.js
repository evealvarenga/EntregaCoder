import { Router } from "express";

const router = Router()

router.get("/", async (req, res) => {
    res.render("home")
    
});

router.get("/realtimeproducts", async (req, res) => {
    res.render("realTimeProducts");
});

router.get("/chat", (req, res) => {
    res.render("chat");
  });

export default router;
