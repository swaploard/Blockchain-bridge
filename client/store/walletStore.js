import { create } from 'zustand'


const useWalletStore = create((set) => ({
    address: null,
    shortAddr: null,
    network: null,
    setAddress: ({address, network}) => set({ 
        address: address || null, 
        shortAddr: address ? `${address.slice(0, 2)}...${address.slice(-4)}` : null,
        network: network || null
    }),
    
}))


export default useWalletStore;