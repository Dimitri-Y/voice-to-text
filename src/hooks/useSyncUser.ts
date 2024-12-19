import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { toast } from "react-toastify";

const useSyncUser = () => {
    const { user } = useUser();
    const [hasSyncedUser, setHasSyncedUser] = useState(false);

    const syncUser = async () => {
        if (!user || hasSyncedUser) return;
        try {
            const res = await fetch("/api/sync-user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();
            setHasSyncedUser(true);
            if (res.status === 200) {
                console.log(data);
            }
            if (res.status === 201) {
                toast.success("User synchronized successfully - update this page");
                console.log(data);
            }
        } catch (error) {
            console.error("Error syncing user:", error);
            toast.error("Error synchronizing user");
        }
    };

    return { syncUser, hasSyncedUser };
};

export default useSyncUser;
