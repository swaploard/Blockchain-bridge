"use client";

import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import useWalletStore from "../../../store/walletStore";
import WalletConnect from "@/components/walletConnect/index";
import originToken from "../../../utils/contracts/OriginToken.json";
import destinationToken from "../../../utils/contracts/DestinationToken.json";
const Destination = () => {

  const OriginNetworkName = process.env.NEXT_PUBLIC_ORIGIN_NETWORK_NAME;
  const DestinationNetworkName = process.env.NEXT_PUBLIC_DESTINATION_NETWORK_NAME;
  const DestinationNetworkId = process.env.NEXT_PUBLIC_DESTINATION_NETWORK_ID;
  
  const originTokenAddress = process.env.NEXT_PUBLIC_ORIGIN_TOKEN_ADDRESS;
  const DestinationTokenAddress = process.env.NEXT_PUBLIC_DESTINATION_CONTRACT_ADDRESS;
  const AmoyRPC = process.env.NEXT_PUBLIC_DESTINATION_NETWORK_RPC;
  const PrivateKey = process.env.NEXT_PUBLIC_BRIDGE_PRIV_KEY

   const bridgeWallet = process.env.NEXT_PUBLIC_BRIDGE_WALLET_ADDRESS;

  const walletStore = useWalletStore();

  const [amount, setAmount] = useState(0);
  const [trxInProgress, setTrxInProgress] = useState(false);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  // const [contract, setContract] = useState(null);
  const [Dcontract, setDcontract] = useState(null);
  const [balance, setBalance] = useState("0");

  useEffect(() => {
    const getSigner = async () => {
      console.log("Getting signer...", typeof window.ethereum !== 'undefined');
      if (typeof window.ethereum !== 'undefined') {
        const newProvider = new ethers.BrowserProvider(window.ethereum);
        const newSigner = await newProvider.getSigner();
        setSigner(newSigner);
        setProvider(newProvider);
      } else {
        console.log('MetaMask is not installed');
      }
    };
    getSigner();
  }, []);
 
  useEffect(() => {
    // if (signer && originTokenAddress) {
    //   const contractInstance = new ethers.Contract(
    //     originTokenAddress,
    //     originToken.abi,
    //     signer
    //   );
    //   setContract(contractInstance);
    // }
    console.log("Signer:", signer);
    console.log("DestinationTokenAddress:", DestinationTokenAddress);
    if (signer && DestinationTokenAddress) {
      const DcontractInstance = new ethers.Contract(
        DestinationTokenAddress,
        destinationToken.abi,
        signer
      );
      setDcontract(DcontractInstance);
    }
    checkBalance();
  }, [signer, originTokenAddress, walletStore.address]);
  console.log("Checking balance...", Dcontract, walletStore.address);

  const checkBalance = async () => {
    if (Dcontract && walletStore.address) {
      try {
        const balance = await Dcontract.balanceOf(walletStore.address);
        const formattedBalance = ethers.formatUnits(balance, 18);
        setBalance(formattedBalance);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    }
  };

  const sendTokens = async () => {
    if (!Dcontract || !amount) {
      console.error("Contract not initialized or amount is zero");
      return;
    }

    const amountFormatted = ethers.parseUnits(amount.toString(), 18);

    if (typeof window.ethereum !== 'undefined') {
      setTrxInProgress(true);

      try {
        console.log("Sending tokens...", bridgeWallet, amountFormatted);
        const transaction = await Dcontract.transfer(
          bridgeWallet,
          amountFormatted
        );

        console.log("Transaction:", transaction);
        await transaction.wait();
        console.log("Transaction confirmed");
        setAmount(0);
        setTrxInProgress(false);
      } catch (error) {
        console.error("Error sending tokens:", error);
        setTrxInProgress(false);
      }
    }
  };

  const handleAmount = (e) => {
    setAmount(e.target.value);
  };
  console.log("",DestinationNetworkId, )
  return (
    <>
      <div className="mt-16 flex flex-col items-center">
        <h1 className="text-center text-2xl font-semibold text-gray-800">
          {`Bridge from ${DestinationNetworkName} to ${OriginNetworkName}`}
        </h1>
        <p className="mt-4 text-center text-gray-600">
          {`This bridge allows you to send Tokens from
          ${DestinationNetworkName} to ${OriginNetworkName}`}
        </p>
        <div className="my-4">
          <WalletConnect
            targetNetwork={DestinationNetworkName}
            targetNetworkId={DestinationNetworkId}
            currency={"POL"}
            decimals={18}
            isNewNetwork={true}
            rpcUrl={AmoyRPC}
            chainId={DestinationNetworkId}
            blockExplorerUrl={process.env.NEXT_PUBLIC_DESTINATION_EXPLORER_URL}
          />
        </div>
        <form className="w-96 mt-8 mx-auto">
          <div className="flex justify-center">
            <label htmlFor="price" className="block mb-2 font-medium text-gray-700">
              How much CHSD do you want to bridge?
            </label>
          </div>
          <div className="mt-4 w-2/3 mx-auto relative rounded-md shadow-sm">
            <input
              type="text"
              onChange={handleAmount}
              name="price"
              id="price"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border border-gray-300 rounded-md py-2"
              placeholder="0.00"
              aria-describedby="price-currency"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm" id="price-currency">
                CHSD
              </span>
            </div>
          </div>
          <div className="flex justify-center items-center flex-col">
            <p className="text-xs mt-4">Your balance is: {balance}</p>
            <button
              type="button"
              onClick={sendTokens}
              disabled={trxInProgress}
              className="inline-flex items-center px-4 py-2 mt-4 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-44"
            >
              {trxInProgress ? `Processing...` : `Bridge to Sepolia`}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Destination;
