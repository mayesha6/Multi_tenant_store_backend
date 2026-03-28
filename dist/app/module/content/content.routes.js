import { Router } from "express";
import { ContentController } from "./content.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { multerUpload } from "../../config/multer.config";
const router = Router();
// Public
router.get("/:type", ContentController.getContent);
// Admin
router.get("/", checkAuth("ADMIN", "SUPER_ADMIN"), ContentController.getAllContents);
router.post("/:type", checkAuth("ADMIN", "SUPER_ADMIN"), multerUpload.single("image"), ContentController.createContent);
router.patch("/:type/:id", checkAuth("ADMIN", "SUPER_ADMIN"), ContentController.updateContent);
router.delete("/:type/:id", checkAuth("ADMIN", "SUPER_ADMIN"), ContentController.deleteContent);
export const ContentRoutes = router;
//# sourceMappingURL=content.routes.js.map