# About

This is a simple blockchain bridge created between the Sepolia and Amoy chains to help understand how a bridge works. It does not handle the complexities of Inter-Blockchain Communication (IBC), which uses a relayer in the background to monitor changes on the blockchains. Instead, it presents a simplified version to illustrate the background operations that occur between the chains.

## Features

* Cross-Chain Asset Transfer: Allows for the secure transfer of tokens between Ethereum and Polygon networks.
* Smart Contract Integration: Utilizes Solidity smart contracts to manage and verify cross-chain transactions.
* User-Friendly Interface: Provides a client application for users to interact with the bridge effortlessly.

## Project Structure
The repository is organized into the following directories:

* backend/: Contains the server-side code responsible for handling bridge operations and communicating with the blockchain networks. 
* client/: Includes the front-end application that offers a user interface for interacting with the bridge.
* solidity/: Houses the Solidity smart contracts that facilitate cross-chain transactions and ensure security.

## Getting Started
To set up the project locally, follow these steps:

Clone the Repository:
```
git clone https://github.com/swaploard/Blockchain-bridge.git
cd Blockchain-bridge
```
Install Dependencies:

Navigate to each directory (backend and client) and install the necessary dependencies:
```
cd backend
npm install
cd ../client
npm install
```
Configure Environment Variables:

Create a .env file in both the backend and client directories with the required environment variables. Refer to the respective README files or documentation within each directory for specific configurations.

Run the Applications:

Start the backend server:
```
cd backend
npm start
```
Then, launch the client application:
```
cd ../client
npm start
```
The client application should now be accessible in your web browser.
