import express from "express";
import { FAQController } from "./faq.controller";
import { checkAuth } from "../../middlewares/checkAuth";

const router = express.Router();

router.post("/", checkAuth("ADMIN", "SUPER_ADMIN"), FAQController.createFAQ);
router.get("/", FAQController.getAllFAQ);
router.get("/:id", FAQController.getSingleFAQ);
router.patch("/:id", checkAuth("ADMIN", "SUPER_ADMIN"), FAQController.updateFAQ);
router.delete("/:id", checkAuth("ADMIN", "SUPER_ADMIN"), FAQController.deleteFAQ);

export const FAQRoutes = router;