import { Router } from "express";

const router = Router()

router.get("/", async (req, res) => {
    res.render("websocket")
    
});

router.get("/realtimeproducts", async (req, res) => {
    res.render("realTimeProducts");
});

router.get("/chat", (req, res) => {
    res.render("chat");
});

router.get("/home",  (req, res) => {
    res.render("home");
});

export default router;
