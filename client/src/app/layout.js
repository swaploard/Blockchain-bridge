"use client"
import "./globals.css";
import Header from "../components/header/header";
import { Button } from "@/components/ui/button";

import { useRouter } from 'next/navigation';

export default function RootLayout({ children }) {
  const router = useRouter();

  return (
    <html lang="en">
      <body>
        <Header />
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center my-5">
          <Button onClick={() => router.push("/")} variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
            Bridge to Destination Chain
          </Button>
          <Button onClick={() => router.push("/destination")} variant="secondary" className="bg-green-600 text-white hover:bg-green-700">
            Send token back to Original Chain
          </Button>
        </div>
        {children}
      </body>
    </html>
  );
}
