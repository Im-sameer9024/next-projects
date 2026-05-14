import { prisma } from "@/config/prisma";

export const FindUniqueUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};
