import { create } from 'zustand'


const useWalletStore = create((set) => ({
    address: null,
    shortAddr: null,
    setAddress: (address) => set({ 
        address: address || null, 
        shortAddr: address ? `${address.slice(0, 2)}...${address.slice(-4)}` : null 
    }),
    
}))


export default useWalletStore;