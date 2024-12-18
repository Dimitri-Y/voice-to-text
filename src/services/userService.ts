import prisma from "../../prisma/client";

interface UserData {
    clerkId: string;
    username: string;
    email: string;
    firstName: string;
}

export const getUserByClerkId = async (clerkId: string) => {
    return await prisma.user.findUnique({ where: { clerkId } });
};
export const getUserByEmail = async (email: string) => {
    return await prisma.user.findUnique({ where: { email } });
};
export const createUser = async (userData: UserData) => {
    return await prisma.user.create({
        data: {
            clerkId: userData.clerkId,
            username: userData.username,
            firstName: userData.firstName,
            email: userData.email,
        },
    });
};

export const deleteUser = async (clerkId: string) => {
    return await prisma.user.delete({ where: { clerkId } });
};
