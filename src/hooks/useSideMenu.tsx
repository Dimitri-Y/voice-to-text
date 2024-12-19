import { SideMenuContext } from "@/providers/sideMenu.provider";
import { useContext } from "react";


export const useSideMenu = () => useContext(SideMenuContext);
