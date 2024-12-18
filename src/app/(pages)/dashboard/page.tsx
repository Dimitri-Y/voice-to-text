'use client';
import Header from "@/components/header";
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
            <main className="container mx-auto py-8">
                {user && (
                    <UploadFileForm />
                )}
            </main>
        </>
    );
};

export default Dashboard;
