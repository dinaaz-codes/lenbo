import { useEffect, useState } from "react";
import Web3 from "web3";

export let web3: Web3;

const getWeb3 = ():Web3 => {
  if (!web3) web3 = new Web3(getProvider());

  return web3;
};

export const getProvider = () => {
  if (!window.ethereum) throw new Error("Please connect metamask!");

  return window.ethereum;
};

web3 = getWeb3();

const useWeb3 = () => {
  const [activeAccount, setActiveAccount] = useState<string>();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [chainId,setChainId] = useState<number>(1);

  const connectWallet = async () => {
    const accounts: string[] = await web3.eth.requestAccounts();
    if(accounts.length <= 0) throw new Error('No accounts found!');

    setActiveAccount(accounts[0]);
    setIsConnected(true);
    setChainId(await getChainId());
  };

  const getChainId = async ():Promise<number> => {
    const chainId = await web3.eth.getChainId();

    return web3.utils.toDecimal(chainId);
  }

  const registerEvents = async () => {
        const provider = getProvider();

        provider.on('accountsChanged',(accounts: Array<string>) => {
            setActiveAccount(accounts[0]);
        });

        provider.on('chainChanged', (chainId: number) => {
            setChainId(web3.utils.toDecimal(chainId));
        });
  }

  const initializeWeb3 = () => {
    web3.eth.getAccounts().then(async (accounts: string[]) => {
      if (accounts.length > 0) {
        setActiveAccount(accounts[0]);
        setIsConnected(true);
        setChainId(await getChainId());
      }
    });

    registerEvents();
  };

  useEffect(() => {
    initializeWeb3();
  }, []);

  useEffect(()=>{
    if(chainId){
    }
  },[chainId])


  return {
    activeAccount,
    chainId,
    isConnected,
    connectWallet,
  };
};

export default useWeb3;