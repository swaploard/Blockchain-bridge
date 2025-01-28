"use client";

import { Wallet } from "lucide-react";
import { WifiIcon } from "lucide-react";

import { useState, useEffect } from "react";
import useWalletStore from "../../../store/walletStore";

export default function WalletConnect({
  targetNetwork,
  targetNetworkId,
  currency,
  decimals,
  isNewNetwork = false,
}) {
  const walletStore = useWalletStore();
  const [networkOk, setNetworkOk] = useState(false);
  const walletAddressAvailable = walletStore.address !== null;
  
  useEffect(() => {
    checkNetwork();
  }, []);
 

  const connectWallet = async () => {
    try {
      const wallet = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      walletStore.setAddress(wallet[0]);
      console.log("DApp connected to your wallet 💰", walletStore.address);
      checkNetwork();
    } catch (error) {
      console.error("Error connecting DApp to your wallet:", error);
    }
  };

  const switchOrAdd = () => {
    isNewNetwork ? addNetwork() : switchNetwork();
  };

  const checkNetwork = async () => {
    if (window.ethereum) {
      const currentChainId = await window.ethereum.request({
        method: "eth_chainId",
      });
      console.log("Current network :>> ", currentChainId);
      setNetworkOk(currentChainId === targetNetworkId);
    }
  };

  const addNetwork = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: targetNetworkId,
            chainName: targetNetwork,
            rpcUrls: [import.meta.env.VITE_DESTINATION_NETWORK_RPC],
            nativeCurrency: {
              name: currency,
              symbol: currency,
              decimals: decimals,
            },
          },
        ],
      });
      checkNetwork();
    } catch (error) {
      console.error("Error adding network:", error);
    }
  };

  const switchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: targetNetworkId }],
      });
      checkNetwork();
    } catch (error) {
      console.error("Error switching network:", error);
    }
  };

  return (
    <div>
      {networkOk ? (
        <button
          type="button"
          disabled={walletAddressAvailable}
          onClick={connectWallet}
          className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 ${
            walletStore.address === "" ? "hover:bg-indigo-600" : ""
          }`}
        >
          <WifiIcon className="h-5 w-5 mr-2" />
          <span>
            {walletAddressAvailable
              ? `Connected Acc ${walletStore.shortAddr}`
              : `Connect Wallet`}
          </span>
        </button>
      ) : (
        <button
          onClick={() => switchOrAdd()}
          className="w-auto inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-pink-700"
        >
          Wrong network. Switch to {targetNetwork}
        </button>
      )}
    </div>
  );
}
