import { createUser, deleteUser, getUserByClerkId, getUserByEmail } from "@/services/userService";
import { handleError } from "@/utils/handleError";
import { userValidator } from "@/validators/userValidator";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        else {
            return Response.json({ message: "User exists" }, { status: 200 });
        }
    } catch (error) {
        return Response.json({ error: handleError(error) }, { status: 500 });
    }
}

export async function POST() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await clerkClient.users.getUser(userId);

        const validatedUser = userValidator({
            clerkId: userId,
            username: user.username || "No username",
            firstName: user.firstName || "Anonymous",
            email: user.emailAddresses[0]?.emailAddress || "No Email",
        });

        const existingUserByEmail = await getUserByEmail(validatedUser.email);
        if (existingUserByEmail && existingUserByEmail.clerkId !== validatedUser.clerkId) {
            await deleteUser(existingUserByEmail.clerkId);
        }

        const existingUser = await getUserByClerkId(userId);
        if (!existingUser) {
            await createUser(validatedUser);
            return Response.json({ message: "User synchronized" }, { status: 201 });
        }

        return Response.json({ message: "User already exists" }, { status: 200 });
    } catch (error) {
        return Response.json({ error: error }, { status: 500 });
    }
}
