import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserControllers } from "./user.controller";
import { updateUserZodSchema } from "./user.validation";
import { multerUpload } from "../../config/multer.config";
import { parseFormDataMiddleware } from "../../middlewares/parseFormDataMiddleware";
import { UserRole } from "@prisma/client";

const router = Router();

router.post("/register", UserControllers.createUser);
router.get(
  "/all-users",
  UserControllers.getAllUsers
);
router.get("/me", checkAuth(...Object.values(UserRole)), UserControllers.getMe);
router.patch(
  "/update-my-profile",
  checkAuth(...Object.values(UserRole)),
  multerUpload.single("file"),          
  parseFormDataMiddleware,              
  validateRequest(updateUserZodSchema), 
  UserControllers.updateMyProfile
);
router.get(
  "/:id",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  UserControllers.getSingleUser
);
router.patch(
  "/:id",
  validateRequest(updateUserZodSchema),
  checkAuth(...Object.values(UserRole)),
  UserControllers.updateUser
);

export const UserRoutes = router;
