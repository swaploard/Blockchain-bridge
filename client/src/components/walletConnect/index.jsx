"use client";

import { Wallet } from "lucide-react";
import useWalletStore from "../../../store/walletStore";

export default function WalletConnect() {
  const walletStore = useWalletStore();

  const connectWallet = async (props) => {
    const { targetNetwork, targetNetworkId, currency, decimals, isNewNetwork } =
      props;
    try {
      const wallet = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      walletStore.setAddress(wallet[0]);
      console.log("DApp connected to your wallet 💰", walletStore.address);
      checkNetwork();
    } catch (error) {
      console.error("Error connecting DApp to your wallet");
      console.error(error);
    }
  };

  const checkNetwork = async () => {
    if (window.ethereum) {
      const currentChainId = await window.ethereum.request({
        method: "eth_chainId",
      });
      console.log("Current network  :>> ", currentChainId);

    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold">Connect your wallet</h2>
      <p className="text-center text-gray-600">
        Connect your wallet to start using the app
      </p>
      <button
        type="button"
        className="mt-4 px-4 py-2 border rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={connectWallet}
      >
        Connect
      </button>
    </div>
  );
}
