'use client';
import useSyncUser from "@/hooks/useSyncUser";
import { useUser, UserButton } from "@clerk/nextjs";
import { useEffect } from "react";

const Header = () => {
    const { user } = useUser();
    const { syncUser } = useSyncUser();
    useEffect(() => {
        syncUser();
    }, [syncUser]);
    return (
        <header className="bg-white-600 text-black py-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-lg font-bold">
                    {user ? `Welcome, ${user.username || user.firstName}` : 'Loading...'}
                </div>
                <nav>
                    <ul className="flex space-x-4">
                        <li>
                            <a href="/dashboard" className="text-black hover:underline">Dashboard</a>
                        </li>
                        {user && (
                            <li>
                                <UserButton />
                            </li>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
