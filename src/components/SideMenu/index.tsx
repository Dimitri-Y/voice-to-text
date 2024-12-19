import { IRecordingGroup } from "@/types/RecordingData";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { RotatingLinesSpinnerForChat } from "@/ui/loaderSpinners";
import GroupRecords from "@/components/GroupRecords";

interface SideMenuProps {
    uuid?: string;
}
const SideMenu: React.FC<SideMenuProps> = ({ uuid }) => {
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
        <aside className="w-full bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 h-screen">
            <div className="overflow-y-auto py-4 px-3 h-full min-w-96">
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
        </aside>
    );
};

export default SideMenu;
