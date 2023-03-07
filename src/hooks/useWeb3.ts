import { useContext, useEffect, useState } from "react";
import Web3Context from "../context/Web3Context";
import { getProvider } from "../utils/web3";

const useWeb3 = () => {
  const [activeAccount, setActiveAccount] = useState<string>();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [chainId,setChainId] = useState<number>(1);
  const web3 = useContext(Web3Context);

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