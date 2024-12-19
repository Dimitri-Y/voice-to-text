'use client';
import Header from "@/components/header";
import SideMenu from "@/components/SideMenu";
import SideMenuMobile from "@/components/SideMenuMobile";
import UploadFileForm from "@/components/uploadFileForm";
import { useUser } from "@clerk/nextjs";

const Dashboard = () => {
    const { user } = useUser();

    return (
        <>
            {user && (
                <Header />
            )
            }
            <div className="flex relative">
                {user && <SideMenuMobile />}
                <div className="hidden md:block w-96">
                    {user && <SideMenu />}
                </div>
                <main className="flex-1 container mx-auto py-8">
                    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
                        <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md lg:max-w-3xl">
                            {user && <UploadFileForm />}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default Dashboard;
