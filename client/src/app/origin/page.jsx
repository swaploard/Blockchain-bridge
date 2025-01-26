import React from "react";
import { WifiIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import WalletConnect from "@/components/walletConnect/index";
const Origin = () => {
  const { ORIGIN_NETWORK_NAME, DESTINATION_NETWORK_NAME } = process.env;
  const OriginNetworkName = ORIGIN_NETWORK_NAME;
  const DestinationNetworkName = DESTINATION_NETWORK_NAME;

  return (
    <>
      {/* Bridge Content */}
      <div className="mt-16 flex flex-col items-center">
        <h1 className="text-center text-2xl font-semibold text-gray-800">
          {`Bridge from ${OriginNetworkName} to ${DestinationNetworkName}`}
        </h1>

        <p className="mt-4 text-center text-gray-600">
          {`This bridge allows you to send Tokens from
          ${OriginNetworkName} to ${DestinationNetworkName}`}
        </p>
         
         <WalletConnect />
        {/* Connection Status */}
        <div className="mt-6 flex items-center gap-2 rounded-full bg-[#4254FF] px-4 py-2 text-white">
          <WifiIcon className="h-4 w-4" />
          <span className="text-sm">Connected Acc 0x...3340</span>
        </div>

        {/* Bridge Form */}
        <div className="mt-8 w-full max-w-md">
          <label className="mb-2 block text-sm text-gray-600">
            How much D-CHSD do you want to bridge?
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              $
            </span>
            <Input type="number" placeholder="0.00" className="pl-8" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              D-CHSD
            </span>
          </div>
          <p className="mt-2 text-center text-sm text-gray-600">
            Your balance is: 0.0049
          </p>

          <Button className="mt-6 w-full bg-[#4254FF] text-white hover:bg-[#3544CC]">
            Bridge to Sepolia
          </Button>
        </div>
      </div>
    </>
  );
};

export default Origin;
