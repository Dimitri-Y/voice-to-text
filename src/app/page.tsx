'use client';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import UploadFileForm from "@/components/uploadFileForm";
import { SignIn, SignUp } from "@clerk/nextjs";
import Header from "@/components/header";
import Link from "next/link";

const Home = () => {
  const { user } = useUser();
  return (
    <>
      {user && (
        <Header />
      )
      }
      <main className="container mx-auto py-8">
        {user ? (
          <UploadFileForm />
        ) : (
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4">Welcome!</h2>
            <div className="flex">

              <SignedOut>
                <SignInButton >
                  <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800 transition duration-300 ease-in-out">
                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                      Sign In or Sign Up
                    </span>
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
                <Link href={"/dashboard"}></Link>
              </SignedIn>
              <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
              <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default Home;
