import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserControllers } from "./user.controller";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { multerUpload } from "../../config/multer.config";
import { parseFormDataMiddleware } from "../../middlewares/parseFormDataMiddleware";
import { UserRole } from "@prisma/client";

const router = Router();

router.post("/register",
  validateRequest(createUserZodSchema), UserControllers.createUser);
router.get(
  "/all-users",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.OWNER, UserRole.ADMIN),
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

router.delete(
  "/:id",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OWNER),
  UserControllers.deleteUserById
);

export const UserRoutes = router;
