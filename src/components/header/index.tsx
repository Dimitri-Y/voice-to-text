"use client";
import { useSideMenu } from "@/hooks/useSideMenu";
import { useUser, UserButton } from "@clerk/nextjs";

const Header = () => {
    const { user } = useUser();
    const { toggleMenu } = useSideMenu();

    return (
        <header className="bg-white text-black py-4 px-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <button
                    type="button"
                    onClick={toggleMenu}
                    className="inline-flex items-center p-3 w-12 h-12 text-base text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 transition duration-300 ease-in-out"
                >
                    <span className="sr-only">Open main menu</span>
                    <svg
                        className="w-10 h-10"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 17 14"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M1 1h15M1 7h15M1 13h15"
                        />
                    </svg>
                </button>
                <div className="text-xl font-bold md:text-3xl">
                    {user ? `Welcome, ${user.username || user.firstName}` : "Loading..."}
                </div>
                <nav>
                    <ul className="flex space-x-4">
                        {user && (
                            <li className="custom-user-button">
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
