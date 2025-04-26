const ethers = require('ethers')
require('dotenv').config()

const {
  mintTokens,
  approveForBurn,
  burnTokens,
  transferToEthWallet,
} = require('./contract-methods.js')

const ORIGIN_TOKEN_CONTRACT_ADDRESS = process.env.ORIGIN_TOKEN_CONTRACT_ADDRESS
const DESTINATION_TOKEN_CONTRACT_ADDRESS =
  process.env.DESTINATION_TOKEN_CONTRACT_ADDRESS
const BRIDGE_WALLET = process.env.BRIDGE_WALLET

const BRIDGE_PRIV_KEY = process.env.BRIDGE_PRIV_KEY

const ORIGIN_TOKEN_CONTRACT_ABI = require('./OriginToken.json')
const DESTINATION_TOKEN_CONTRACT_ABI = require('./DestinationToken.json')

const handleEthEvent = async (event, provider, contract) => {
  const { from, to, value } = event.returnValues
  console.log('to :>> ', to)
  console.log('from :>> ', from)
  console.log('value :>> ', value)
  console.log('============================')
  console.log("handleEthEvent Contract:", !!contract);
  console.log("Is Contract Instance:", contract instanceof ethers.Contract);
  if (from == BRIDGE_WALLET) {
    console.log('Transfer is a bridge back')
    return
  }
  if (to == BRIDGE_WALLET && to != from) {
    console.log('Tokens received on bridge from ETH chain! Time to bridge!')

    try {
      const tokensMinted = await mintTokens(provider, contract, value, from, event)
      if (!tokensMinted) return
      console.log('🌈🌈🌈🌈🌈 Bridge to destination completed')
    } catch (err) {
      console.error('Error processing transaction', err)
      // TODO: return funds
    }
  } else {
    console.log('Another transfer')
  }
}

const handleDestinationEvent = async (
  event,
  provider,
  contract,
  providerDest,
  contractDest
) => {
  const { from, to, value } = event.returnValues
  console.log('handleDestinationEvent')
  console.log('to :>> ', to)
  console.log('from :>> ', from)
  console.log('value :>> ', value)
  console.log('============================')

  if (from == process.env.WALLET_ZERO) {
    console.log('Tokens minted')
    return
  }

  if (to == BRIDGE_WALLET && to != from) {
    console.log(
      'Tokens received on bridge from destination chain! Time to bridge back!'
    )

    try {
      // we need to approve burn, then burn
      const tokenBurnApproved = await approveForBurn(
        providerDest,
        contractDest,
        value
      )
      if (!tokenBurnApproved) return
      console.log('Tokens approved to be burnt')
      const tokensBurnt = await burnTokens(providerDest, contractDest, value)

      if (!tokensBurnt) return
      console.log(
        'Tokens burnt on destination, time to transfer tokens in ETH side'
      )
      const transferBack = await transferToEthWallet(
        provider,
        contract,
        value,
        from
      )
      if (!transferBack) return

      console.log('Tokens transfered to ETH wallet')
      console.log('🌈🌈🌈🌈🌈 Bridge back operation completed')
    } catch (err) {
      console.error('Error processing transaction', err)
      // TODO: return funds
    }
  } else {
    console.log('Something else triggered Transfer event')
  }
}

const main = async () => {
  console.log('Connecting to providers...')
  console.log('ORIGIN_WSS_ENDPOINT :>> ', process.env.ORIGIN_WSS_ENDPOINT)
  console.log('DESTINATION_HTTPS_ENDPOINT :>> ', process.env.DESTINATION_HTTPS_ENDPOINT)
  console.log('ORIGIN_TOKEN_CONTRACT_ADDRESS :>> ', ORIGIN_TOKEN_CONTRACT_ADDRESS)

  // Replace JsonRpcProvider with WebSocketProvider for WebSocket connections
  const originProvider = new ethers.WebSocketProvider(process.env.ORIGIN_WSS_ENDPOINT);
  const destinationProvider = new ethers.JsonRpcProvider(process.env.DESTINATION_HTTPS_ENDPOINT);

  // Create wallet instances for signing transactions
  const originWallet = new ethers.Wallet(BRIDGE_PRIV_KEY, originProvider)
  const destinationWallet = new ethers.Wallet(BRIDGE_PRIV_KEY, destinationProvider)

  const oriNetworkId = await originProvider.getNetwork().then(network => network.chainId)
  const destNetworkId = await destinationProvider.getNetwork().then(network => network.chainId)

  console.log('oriNetworkId :>> ', oriNetworkId)
  console.log('destNetworkId :>> ', destNetworkId)

  console.log("Origin ABI is array?", Array.isArray(ORIGIN_TOKEN_CONTRACT_ABI.abi));
  console.log("Destination ABI is array?", Array.isArray(DESTINATION_TOKEN_CONTRACT_ABI.abi));

  // Check mint function existence
  const hasMintFunction = DESTINATION_TOKEN_CONTRACT_ABI.abi.some(
    item => item.type === "function" && item.name === "mint"
  );
  console.log("Destination contract has mint function?", hasMintFunction);
  // Initialize contracts with ethers
  const originTokenContract = new ethers.Contract(
    ORIGIN_TOKEN_CONTRACT_ADDRESS,
    ORIGIN_TOKEN_CONTRACT_ABI.abi,
    originWallet
  )

  const destinationTokenContract = new ethers.Contract(
    DESTINATION_TOKEN_CONTRACT_ADDRESS,
    DESTINATION_TOKEN_CONTRACT_ABI.abi,
    destinationWallet
  )
  console.log("Destination Contract Instance:", !!destinationTokenContract.mint);
  // Set up event listeners using ethers
  originTokenContract.on('Transfer', async (from, to, value, event) => {
    console.log('originTokenContract-------------------------------------------------- :>> ')
    await handleEthEvent(
      { returnValues: { from, to, value } },
      destinationProvider,
      destinationTokenContract
    )
  })

  destinationTokenContract.on('Transfer', async (from, to, value, event) => {
    console.log("destinationTokenContract----------------------------------------------------------")
    await handleDestinationEvent(
      { returnValues: { from, to, value } },
      originProvider,
      originTokenContract,
      destinationProvider,
      destinationTokenContract
    )
  })

  console.log(`Waiting for Transfer events on ${ORIGIN_TOKEN_CONTRACT_ADDRESS}`)
  console.log(`Waiting for Transfer events on ${DESTINATION_TOKEN_CONTRACT_ADDRESS}`)
}

main()
