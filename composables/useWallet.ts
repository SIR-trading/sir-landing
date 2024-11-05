import { useOnboard } from "@web3-onboard/vue";
import { ethers } from "ethers";
import { computed } from "vue";
import {useWalletStore} from "~/stores/wallet";
import {useEnv} from "~/composables/useEnv";
import {useToast} from "#ui/composables/useToast";

export const useWallet = () => {
  const { connectedWallet } = useOnboard();
  const toast = useToast()
  return {
    isConnected: computed(() => {
      return !!connectedWallet.value?.accounts[0].address;
    }),
    address: computed(() => {
      return connectedWallet.value?.accounts[0].address;
    }),
    getSigner: async (): Promise<ethers.JsonRpcSigner|null|undefined> => {
      if (!connectedWallet.value) {
        console.error('No connected wallet');
        return null; // Return null instead of throwing an error
      }
      try {
        const walletProvider = connectedWallet.value?.provider as ethers.Eip1193Provider;
        const chain = connectedWallet.value?.chains[0].id;
        const browserProvider = new ethers.BrowserProvider(walletProvider, parseInt(chain));
        return new ethers.JsonRpcSigner(browserProvider, connectedWallet.value.accounts[0].address as string) as ethers.JsonRpcSigner;
      } catch (e) {
        console.error(e);
      }
    },
    isChainCorrect: computed(() => {
      const {chain} = useEnv()
      if (!chain) return false
      if (useWalletStore().getChainId)
        return chain.id.toString() === connectedWallet.value?.chains[0].id.toString()
    }),
    changeChain: async () => {
      const {chain} = useEnv()
      const provider = connectedWallet.value?.provider as ethers.Eip1193Provider
      provider.request({method: 'wallet_switchEthereumChain', params: [{chainId: chain.id}]}).then(() => {
        toast.add({
          title: 'Chain Switched',
          description: `Switched to ${chain.label}`,
          color: 'green',
          timeout: 5000,
        })
      }).catch((error) => {
        console.error(error)
        toast.add({
          title: 'Chain Switch Failed',
          description: `Failed to switch to ${chain.label}`,
          color: 'red',
          timeout: 5000,
        })
      })
    }
  };
};