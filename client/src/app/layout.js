import "./globals.css";
import Header from "../components/header/header";
import { Button } from "@/components/ui/button";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center my-5">
          <Button variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
            Bridge to Destination Chain
          </Button>
          <Button variant="secondary" className="bg-green-600 text-white hover:bg-green-700">
            Send token back to Original Chain
          </Button>
        </div>
        {children}
      </body>
    </html>
  );
}
