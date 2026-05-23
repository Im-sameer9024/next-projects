import { prisma } from "../../config/prisma.js";
export const FindUniqueUserByEmail = async (email) => {
    return await prisma.user.findUnique({
        where: {
            email,
        },
    });
};
export const FindUniqueUserById = async (id) => {
    return await prisma.user.findUnique({
        where: {
            id: id,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            avatar: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};
//# sourceMappingURL=auth.services.js.map