"use server";

import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export const admin = async () => {
  const userRole = await currentRole();

  if (userRole === UserRole.ADMIN) {
    return { success: "Allowed" };
  }

  return { error: "Forbidden" };
};
