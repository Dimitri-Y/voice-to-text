"use client";
import { createContext, useState } from "react";

export interface SideMenuContextProps {
    isOpen: boolean;
    toggleMenu: () => void;
    closeMenu: () => void;
}
export const SideMenuContext = createContext<SideMenuContextProps>({
    isOpen: false,
    toggleMenu: () => { },
    closeMenu: () => { },
});

export const SideMenuProvider = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen((prev) => !prev);
    const closeMenu = () => setIsOpen(false);

    return (
        <SideMenuContext.Provider value={{ isOpen, toggleMenu, closeMenu }
        }>
            {children}
        </SideMenuContext.Provider>
    );
};