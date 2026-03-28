import bcryptjs from "bcryptjs";
import { envVars } from "../config/env";
import prisma from "../lib/prisma";
import { UserRole } from "@prisma/client";

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await prisma.user.findUnique({
      where: { email: envVars.SUPER_ADMIN_EMAIL },
    });

    if (isSuperAdminExist) {
      console.log("Super Admin Already Exists!");
      return;
    }

    console.log("Trying to create Super Admin...");

    const hashedPassword = await bcryptjs.hash(
      envVars.SUPER_ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    const superadmin = await prisma.user.create({
      data: {
        name: "Super admin",
        role: UserRole.SUPER_ADMIN,
        email: envVars.SUPER_ADMIN_EMAIL,
        password: hashedPassword,
        isVerified: true,
        auths: {
          create: [
            {
              provider: "credentials",
              providerId: envVars.SUPER_ADMIN_EMAIL,
            },
          ],
        },
      },
      include: {
        auths: true,
      },
    });

    console.log("Super Admin Created Successfully! \n");
    console.log(superadmin);
  } catch (error) {
    console.log(error);
  }
};