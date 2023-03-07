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