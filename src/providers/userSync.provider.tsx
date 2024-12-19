// UserSyncProvider.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-toastify";

type UserSyncContextType = {
    hasSyncedUser: boolean;
    isSyncing: boolean;
};

const UserSyncContext = createContext<UserSyncContextType | undefined>(undefined);

export const UserSyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useUser();
    const [hasSyncedUser, setHasSyncedUser] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        const syncUser = async () => {
            if (!user || hasSyncedUser) return;

            setIsSyncing(true);
            try {
                const res = await fetch("/api/sync-user", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                });

                const data = await res.json();
                if (res.status === 200) {
                    setHasSyncedUser(true);
                    console.log(data);
                }
                if (res.status === 201) {
                    setHasSyncedUser(true);
                    toast.success("User synchronized successfully - update this page");
                    console.log(data);
                }
            } catch (error) {
                console.error("Error syncing user:", error);
                toast.error("Error synchronizing user");
            } finally {
                setIsSyncing(false);
            }
        };

        syncUser();
    }, [user, hasSyncedUser]);

    return (
        <UserSyncContext.Provider value={{ hasSyncedUser, isSyncing }}>
            {children}
        </UserSyncContext.Provider>
    );
};

export const useUserSync = () => {
    const context = useContext(UserSyncContext);
    if (!context) {
        throw new Error("useUserSync must be used within a UserSyncProvider");
    }
    return context;
};
