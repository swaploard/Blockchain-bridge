const BRIDGE_WALLET = process.env.BRIDGE_WALLET
const ORIGIN_TOKEN_CONTRACT_ADDRESS = process.env.ORIGIN_TOKEN_CONTRACT_ADDRESS
const DESTINATION_TOKEN_CONTRACT_ADDRESS =
  process.env.DESTINATION_TOKEN_CONTRACT_ADDRESS
const BRIDGE_PRIVATE_KEY = process.env.BRIDGE_PRIV_KEY
const WALLET_ZERO=process.env.WALLET_ZERO
const DESTINATION_HTTPS_ENDPOINT=process.env.DESTINATION_HTTPS_ENDPOINT
const ethers = require('ethers')
// const mintTokens = async (provider, contract, amount, address) => {
//   try {
//     const trx = contract.methods.mint(address, amount)

//     const gas = await trx.estimateGas({ from: BRIDGE_WALLET })
//     console.log('gas :>> ', gas)
//     const gasPrice = await provider.eth.getGasPrice()
//     console.log('gasPrice :>> ', gasPrice)
//     const data = trx.encodeABI()
//     console.log('data :>> ', data)
//     const nonce = 90

//     console.log('nonce :>> ', nonce)

//     const trxData = {
//       // trx is sent from the bridge wallet
//       from: BRIDGE_WALLET,
//       // destination of the transaction is the ERC20 token address
//       to: DESTINATION_TOKEN_CONTRACT_ADDRESS,

//       data,
//       gas,
//       gasPrice,
//       nonce,
//     }

//     console.log('Transaction ready to be sent')

//     const receipt = await provider.eth.sendTransaction(trxData)
//     console.log(`Transaction sent, hash is ${receipt.transactionHash}`)
//     console.log(
//       `mintTokens > You can see this transaction in ${process.env.DESTINATION_EXPLORER}${receipt.transactionHash}`
//     )
//   } catch (error) {
//     console.error('Error in mintTokens >', error)
//     return false
//   }
// }

const mintTokens = async (provider, contract, amount, address, event, debug = false) => {
  if (debug) console.log("Debug mode enabled");

  // Validate inputs
  if (!provider || !contract || !amount || !address) {
    console.error("mintTokens > Invalid input parameters:", { provider, contract, amount, address });
    return false;
  }

  try {
    if (debug) console.log("Preparing mint transaction");

    // Create the mint transaction
    const trx = contract.methods.mint(address, amount);

    // Estimate gas
    const gas = await trx.estimateGas({ from: BRIDGE_WALLET });
    if (debug) console.log("Estimated gas:", gas);

    // Get gas price
    const gasPrice = await provider.eth.getGasPrice();
    if (debug) console.log("Current gas price:", gasPrice);

    // Encode transaction data
    const data = trx.encodeABI();
    if (debug) console.log("Encoded transaction data:", data);

    // Get nonce
    const nonce = await provider.eth.getTransactionCount(BRIDGE_WALLET);
    if (debug) console.log("Transaction nonce:", nonce);

    // Prepare the transaction object
    const trxData = {
      from: BRIDGE_WALLET,
      to: DESTINATION_TOKEN_CONTRACT_ADDRESS,
      data,
      gas,
      gasPrice,
      nonce,
    };

    if (debug) console.log("Transaction data ready to be signed:", trxData);

    // Sign the transaction
    const signedTx = await provider.eth.accounts.signTransaction(trxData, BRIDGE_PRIVATE_KEY);
    if (debug) console.log("Transaction signed:", signedTx);

    // Send the signed transaction
    const receipt = await provider.eth.sendSignedTransaction(signedTx.rawTransaction);

    console.log(`Transaction sent successfully. Hash: ${receipt.transactionHash}`);
    console.log(`View on explorer: ${process.env.DESTINATION_EXPLORER}${receipt.transactionHash}`);

    return true;
  } catch (error) {
    // Handle errors in different parts of the flow
    if (error.message.includes("estimateGas")) {
      console.error("mintTokens > Error estimating gas:", error);
    } else if (error.message.includes("signTransaction")) {
      console.error("mintTokens > Error signing transaction:", error);
    } else if (error.message.includes("sendSignedTransaction")) {
      console.error("mintTokens > Error sending transaction:", error);
    } else {
      console.error("mintTokens > Unexpected error:", error);
    }

    if (debug) console.error("Stack trace:", error.stack);

    return false;
  }
};

const transferToEthWallet = async (provider, contract, amount, address) => {

  try {
    console.log('Transfering tokens to ETH wallet 💸💸💸💸💸')
    console.log('address :>> ', address)
    console.log('amount :>> ', amount)
    const trx = contract.methods.transfer(address, amount)

    const gas = await trx.estimateGas({ from: BRIDGE_WALLET })
    console.log('gas :>> ', gas)
    const gasPrice = await provider.eth.getGasPrice()
    console.log('gasPrice :>> ', gasPrice)
    const data = trx.encodeABI()
    console.log('data :>> ', data)
    const nonce = await provider.eth.getTransactionCount(BRIDGE_WALLET)

    console.log('nonce :>> ', nonce)

    const trxData = {
      // trx is sent from the bridge wallet
      from: BRIDGE_WALLET,
      // destination of the transaction is the ERC20 token address
      to: ORIGIN_TOKEN_CONTRACT_ADDRESS,
      // data contains the amount and receiver params for transfer
      data,
      // TO TEST!!!
      gas: Math.ceil(gas * 1.2),
      gasPrice,
      nonce,
    }

    // console.log('signedTrx :>> ', signedTrx.rawTransaction)

    console.log('Transaction ready to be sent')

    const receipt = await provider.eth.sendTransaction(trxData)
    console.log(`Transaction sent, hash is ${receipt.transactionHash}`)
    console.log(
      `transferToEthWallet > You can see this transaction in ${process.env.ORIGIN_EXPLORER}${receipt.transactionHash}`
    )
    return true
  } catch (error) {
    console.error('Error in transferToEthWallet >', error)
    return false
  }
}
// const approveForBurn = async (provider, contract, amount) => {
//   try {
//     console.log('Approving token burn 🔥🔥🔥🔥🔥')
//     console.log('amount :>> ', amount)
//     console.log('contract.options.address :>> ', contract.options.address)
//     const trx = contract.methods.approve(BRIDGE_WALLET, amount)

//     const gas = await trx.estimateGas({ from: BRIDGE_WALLET })
//     console.log('gas :>> ', gas)
//     const gasPrice = await provider.eth.getGasPrice()
//     console.log('gasPrice :>> ', gasPrice)
//     const data = trx.encodeABI()
//     console.log('data :>> ', data)
//     const nonce = await provider.eth.getTransactionCount(BRIDGE_WALLET)

//     console.log('nonce :>> ', nonce)

//     const trxData = {
//       // trx is sent from the bridge wallet
//       from: BRIDGE_WALLET,
//       // destination of the transaction is the ERC20 token address
//       to: contract.options.address,
//       data,
//       // hardcoded gasPrice as estimation is not correct
//       gas: 60000,
//       gasPrice,
//       nonce,
//     }

//     console.log('Transaction ready to be sent')

//     const receipt = await provider.eth.sendTransaction(trxData)
//     console.log(`Transaction sent, hash is ${receipt.transactionHash}`)
//     console.log(
//       `approveForBurn > You can see this transaction in ${process.env.DESTINATION_EXPLORER}${receipt.transactionHash}`
//     )
//     return true
//   } catch (err) {
//     console.error('Error in approveForBurn > ', err)
//     return false
//   }
// }

const approveForBurn = async (provider, contract, amount) => {
  try {
    console.log('Approving token burn 🔥🔥🔥🔥🔥');
    console.log('amount :>> ', amount);
    console.log('contract.options.address :>> ', contract.options.address);

    const trx = contract.methods.approve(BRIDGE_WALLET, amount);
    const gas = await trx.estimateGas({ from: BRIDGE_WALLET });
    const gasPrice = await provider.eth.getGasPrice();
    const data = trx.encodeABI();
    const providerEthers = new ethers.JsonRpcProvider(DESTINATION_HTTPS_ENDPOINT);
    const nonce = await providerEthers.getTransactionCount(BRIDGE_WALLET)

    // const nonce = await provider.eth.getTransactionCount(BRIDGE_WALLET, "pending");
    console.log("Transaction nonce:", nonce);
    const trxData = {
      from: BRIDGE_WALLET,
      to: contract.options.address,
      data,
      gas,
      gasPrice,
      nonce,
    };

    console.log('Signing transaction...');
    const signedTx = await provider.eth.accounts.signTransaction(trxData, BRIDGE_PRIVATE_KEY);

    console.log('Sending signed transaction...');
    const receipt = await provider.eth.sendSignedTransaction(signedTx.rawTransaction);

    console.log(`Transaction sent, hash: ${receipt.transactionHash}`);
    console.log(`approveForBurn > You can see this transaction in ${process.env.DESTINATION_EXPLORER}${receipt.transactionHash}`);
    return true;
  } catch (err) {
    console.error('Error in approveForBurn > ', err);
    return false;
  }
};


const burnTokens = async (provider, contract, amount) => {
  try {
    console.log('Burning tokens from wallet 🔥🔥🔥🔥🔥')
    console.log('amount :>> ', amount)
    console.log('contract.options.address :>> ', contract.options.address)
    const trx = contract.methods.burnFrom(BRIDGE_WALLET, amount)

    const gas = await trx.estimateGas({ from: BRIDGE_WALLET })
    console.log('gas :>> ', gas)
    const gasPrice = await provider.eth.getGasPrice()
    console.log('gasPrice :>> ', gasPrice)
    const data = trx.encodeABI()
    console.log('data :>> ', data)
    const nonce = await provider.eth.getTransactionCount(BRIDGE_WALLET)

    console.log('nonce :>> ', nonce)

    const trxData = {
      // trx is sent from the bridge wallet
      from: BRIDGE_WALLET,
      // destination of the transaction is the ERC20 token address
      to: contract.options.address,
      data,
      // hardcoded gasPrice as estimation is not correct
      gas,
      gasPrice,
      nonce,
    }

    console.log('Transaction ready to be sent')

    const receipt = await provider.eth.sendTransaction(trxData)
    console.log(`Transaction sent, hash is ${receipt.transactionHash}`)
    console.log(
      `burnTokens > You can see this transaction in ${process.env.DESTINATION_EXPLORER}${receipt.transactionHash}`
    )
    return true
  } catch (err) {
    console.error('Error in burnTokens > ', err)
    return false
  }
}

module.exports = {
  mintTokens,
  approveForBurn,
  burnTokens,
  transferToEthWallet,
}
