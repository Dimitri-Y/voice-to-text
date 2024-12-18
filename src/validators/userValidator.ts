import { z } from "zod";

const UserSchema = z.object({
    clerkId: z.string().min(1, "Clerk ID is required"),
    username: z.string().min(1, "Name is required"),
    firstName: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
});
export type UserData = z.infer<typeof UserSchema>;
export const userValidator = (data: UserData) => {
    return UserSchema.parse(data);
};