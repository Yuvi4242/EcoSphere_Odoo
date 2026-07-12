"use client";
import Head from 'next/head';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export default function Home() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };
  return (
    <>


      <div className="flex h-screen w-full">

        <div className="flex-1 flex items-center justify-center p-8 bg-gray-500">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-center mb-6 text-black">Welcome to Donezo</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Button
                type="button"
                className="w-full flex items-center text-black justify-center gap-2 border bg-white border-gray-300 font-medium py-3 px-4 rounded-full hover:bg-gray-50 transition duration-300"
                onClick={() => {
                  signIn("google", { callbackUrl: "/" });
                }}
              >
                <Image src="/google.png" alt="Google" width={20} height={20} />
                Log in with Google
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}