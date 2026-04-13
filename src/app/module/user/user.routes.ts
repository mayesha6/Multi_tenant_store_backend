import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserControllers } from "./user.controller";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { multerUpload } from "../../config/multer.config";
import { parseFormDataMiddleware } from "../../middlewares/parseFormDataMiddleware";
import { UserRole } from "@prisma/client";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserControllers.createUser
);

router.get(
  "/all-users",
  checkAuth(UserRole.OWNER, UserRole.ADMIN, UserRole.SUPER_ADMIN), // ❗ refined
  UserControllers.getAllUsers
);

router.get(
  "/me",
  checkAuth(...Object.values(UserRole)),
  UserControllers.getMe
);

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
  checkAuth(UserRole.OWNER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  UserControllers.getSingleUser
);

router.patch(
  "/:id",
  checkAuth(UserRole.OWNER, UserRole.ADMIN, UserRole.SUPER_ADMIN), // ❗ viewer remove
  validateRequest(updateUserZodSchema),
  UserControllers.updateUser
);

router.delete(
  "/:id",
  checkAuth(UserRole.OWNER, UserRole.SUPER_ADMIN),
  UserControllers.deleteUserById
);

export const UserRoutes = router;
