import { getUserByClerkId } from "@/services/userService";
import { handleError } from "@/utils/handleError";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        else {
            const user = await getUserByClerkId(userId);
            return Response.json(user, { status: 200 });
        }
    } catch (error) {
        return Response.json({ error: handleError(error) }, { status: 500 });
    }
}