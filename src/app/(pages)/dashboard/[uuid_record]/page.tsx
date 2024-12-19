'use client';
import Header from "@/components/header";
import RecordingCard from "@/components/RecordingCard";
import SideMenu from "@/components/SideMenu";
import SideMenuMobile from "@/components/SideMenuMobile";
import UploadFileFormWithUuid from "@/components/uploadFileFormWithUuid";
import { useApi } from "@/hooks/useApi";
import { IRecording } from "@/types/RecordingData";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const Dashboard = () => {
    const { user } = useUser();
    const { uuid_record } = useParams();
    const [recording, setRecording] = useState<IRecording>();
    const { request, isLoading, error } = useApi();

    useEffect(() => {
        const fetchRecordings = async () => {
            const responseData = await request(`/api/recording/${uuid_record}`, { method: 'GET' });
            setRecording(responseData);
        };
        fetchRecordings();
    }, []);
    return (
        <>
            {user && (
                <Header />
            )}
            <main className="flex relative">
                {user && <SideMenuMobile uuid={uuid_record as string} />}
                <div className="hidden md:block w-96">
                    {user && <SideMenu uuid={uuid_record as string} />}
                </div>
                <div className="flex-1 container mx-auto py-8">
                    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
                        <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md lg:max-w-3xl">
                            {user && recording && <UploadFileFormWithUuid recording={recording} />}
                            {uuid_record && <RecordingCard isLoading={isLoading} recording={recording as IRecording} error={error} />}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Dashboard;
