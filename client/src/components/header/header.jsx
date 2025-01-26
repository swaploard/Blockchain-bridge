import React from 'react';
import Image from 'next/image'
function Header() {
  return (
    <header className="bg-[#4254FF] px-6 py-4">
        <div className="flex items-center gap-2">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Blockchain%20bridge-ht8Rr2wmP14ZX0GNRwqrYBTEvfAtdW.png"
            alt="Chainstack Logo"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <span className="text-xl font-medium text-white">Bridge</span>
        </div>
      </header>
  );
}

export default Header;

