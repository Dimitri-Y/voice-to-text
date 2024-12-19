'use client';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { SignIn, SignUp } from "@clerk/nextjs";
import Link from "next/link";

const Home = () => {
  return (
    <main className="container mx-auto py-8">
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">Welcome!</h2>
        <div className="flex">
          <SignedOut>
            <SignInButton>
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
        {/* "Sourced By Clerk" Section */}
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Sourced By Clerk
        </div>
        {/* User Instructions */}
        <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">How to Use This App</h3>
          <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
            <li>Create an account or sign in using the &quot;Sign In or Sign Up&quot; button.</li>
            <li>Once signed in, you can upload voice recordings on the dashboard.</li>
            <li>Your recordings will be processed into text using OpenAI&apos;s API.</li>
            <li>All actions, including uploads and processing, are logged in the database.</li>
            <li>View your past recordings on the dashboard in a list format, similar to ChatGPT.</li>
          </ul>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            If you encounter any issues, please contact support.
          </p>
        </div>
      </div>
    </main>
  );
};

export default Home;
