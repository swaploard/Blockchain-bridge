import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WifiIcon } from "lucide-react";

export default function Home() {
  return (
    <div>
      <main className="mx-auto max-w-2xl px-4 py-8">
        {/* Action Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
            Bridge to Destination Chain
          </Button>
          <Button variant="secondary" className="bg-green-600 text-white hover:bg-green-700">
            Send token back to Original Chain
          </Button>
        </div>


      </main>
    </div>
  );
}
