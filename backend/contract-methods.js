const BRIDGE_WALLET = process.env.BRIDGE_WALLET

const mintTokens = async (provider, contract, amount, address) => {
  try {
    if (!contract?.mint) {
      throw new Error("Contract or mint function undefined");
    }

    const bigIntAmount = BigInt(amount.toString());
    const tx = await contract.mint(address, bigIntAmount);
    tx.wait();
    return true;
  } catch (error) {
    console.error("Mint Error:", error);
    return false;
  }
};

const transferToEthWallet = async (provider, contract, amount, address) => {
  try {
    console.log('Transfering tokens to ETH wallet 💸💸💸💸💸');

    const tx = await contract.transfer(address, amount);
    console.log(`Transaction submitted: ${tx.hash}`);
    
    const receipt = await tx.wait();
    console.log(`Transaction confirmed in block: ${receipt.blockNumber}`);
    console.log(`transferToEthWallet > You can see this transaction in ${process.env.ORIGIN_EXPLORER}${tx.hash}`);
    return true;
  } catch (error) {
    console.error('Error in transferToEthWallet >', error);
    return false;
  }
};

const approveForBurn = async (provider, contract, amount) => {
  try {
    console.log('Approving token burn 🔥🔥🔥🔥🔥');
    console.log('amount :>> ', amount);
 
    const tx = await contract.approve(BRIDGE_WALLET, amount);
    // Wait for confirmation
    const receipt = await tx.wait();
    console.log(`Transaction confirmed in block: ${receipt.blockNumber}`);
    console.log(`approveForBurn > You can see this transaction in ${process.env.DESTINATION_EXPLORER}${tx.hash}`);
    return true;
  } catch (err) {
    console.error('Error in approveForBurn > ', err);
    return false;
  }
};


const burnTokens = async (provider, contract, amount) => {
  try {
    console.log('Burning tokens from wallet 🔥🔥🔥🔥🔥');

    const tx = await contract.burnFrom(BRIDGE_WALLET, amount);
    console.log(`Transaction submitted: ${tx.hash}`);
    
    const receipt = await tx.wait();
    console.log(`Transaction confirmed in block: ${receipt.blockNumber}`);
    console.log(`burnTokens > You can see this transaction in ${process.env.DESTINATION_EXPLORER}${tx.hash}`);
    return true;
  } catch (err) {
    console.error('Error in burnTokens > ', err);
    return false;
  }
};

module.exports = {
  mintTokens,
  approveForBurn,
  burnTokens,
  transferToEthWallet,
}
