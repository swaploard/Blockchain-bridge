import { create } from 'zustand'


const useWalletStore = create((set) => ({
    address: null,
    setAddress: (address) => set({ address }),
}))


export default useWalletStore;