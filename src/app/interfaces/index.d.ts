// declare global {
//     namespace Express {
//         interface Request {
//             user: JwtPayload
//         }
//     }
// }
import { UserRole } from "@prisma/client";

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      role: UserRole; // better than string
    }
  }
}

export {};