import { useOnboard } from "@web3-onboard/vue";
import { ethers } from "ethers";
import { computed } from "vue";

export const useWallet = () => {
  const { connectedWallet } = useOnboard();

  return {
    isConnected: computed(() => {
      return !!connectedWallet.value?.accounts[0].address;
    }),
    address: computed(() => {
      return connectedWallet.value?.accounts[0].address;
    }),
    getSigner: async (): Promise<ethers.JsonRpcSigner | null> => {
      if (!connectedWallet.value) {
        console.error('No connected wallet');
        return null; // Return null instead of throwing an error
      }
      try {
        const walletProvider = connectedWallet.value?.provider as ethers.Eip1193Provider;
        const chain = connectedWallet.value?.chains[0].id;
        const browserProvider = new ethers.BrowserProvider(walletProvider, parseInt(chain));
        console.log("browserProvider", browserProvider);
        return new ethers.JsonRpcSigner(browserProvider, connectedWallet.value.accounts[0].address as string) as ethers.JsonRpcSigner;
      } catch (e) {
        console.error(e);
      }
    },
    hasAgreed: computed((): boolean => {
      if (!connectedWallet.value?.accounts[0].address) return true;
      const wallet = localStorage.getItem(`wallet-${connectedWallet.value?.accounts[0].address}`)
      return !!wallet;
    })
  };
};