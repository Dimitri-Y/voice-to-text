import { useApi } from "@/hooks/useApi";
import { useSideMenu } from "@/hooks/useSideMenu";
import { IRecordingGroup } from "@/types/RecordingData";
import { RotatingLinesSpinnerForChat } from "@/ui/loaderSpinners";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import GroupRecords from "../GroupRecords.tsx";

interface SideMenuProps {
    uuid?: string;
}
const SideMenuMobile: React.FC<SideMenuProps> = ({ uuid }) => {
    const { isOpen, closeMenu } = useSideMenu();
    const { request, isLoading, error } = useApi();

    const [recordings, setRecordings] = useState<IRecordingGroup[]>([]);
    useEffect(() => {
        const fetchRecordings = async () => {
            const responseData = await request('/api/recording', { method: 'GET', });
            setRecordings(responseData);
        };
        fetchRecordings();
    }, []);

    const groupedRecordings = useMemo(() => {
        return recordings;
    }, [recordings]);

    return (
        <div
            className={`absolute top-0 left-0 w-full h-full bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 
            transform ${isOpen ? "translate-x-0" : "-translate-x-full"}
            transition-transform duration-300 ease-in-out z-50 md:hidden` }
        >
            <button
                type="button"
                onClick={closeMenu}
                className="absolute top-4 right-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 md:hidden"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-9 h-9" >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <div className="overflow-y-auto py-4 px-3 h-full">
                <ul className="space-y-2">
                    {isLoading ? (
                        <div className="flex justify-center items-center">
                            < RotatingLinesSpinnerForChat color={"#fff"}></RotatingLinesSpinnerForChat>
                        </div>
                    ) : error ? (
                        <div className="text-red-500">Error uploading records</div>
                    ) : <>
                        {uuid && (
                            <li>
                                <Link href={`/dashboard`} passHref>
                                    <h3 className="px-4 py-2 text-2xl  font-semibold text-gray-900 dark:text-white dark:text-white hover:text-blue-500 dark:hover:text-blue-300 transition duration-300 ease-in-out"> To upload new Record
                                    </h3>
                                </Link>
                            </li>)}
                        <GroupRecords groupedRecordings={groupedRecordings} />
                    </>
                    }
                </ul>
            </div>
        </div>
    );
};

export default SideMenuMobile;
