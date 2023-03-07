import { useContext, useEffect, useState } from "react";
import Web3Context from "../context/Web3Context";
import axios from "axios";

const useCoinGecko = () => {
  const [reservesList, setReservesList] = useState();

  const getTokenDetails = async (chainId: number, tokenAddresses: string[]) => {
    const tokenDetailsPromises = tokenAddresses.map((tokenAddress) => {
      return axios.get(
        `https://api.coingecko.com/api/v3/coins/${chainId}/contract/${tokenAddress}`
      );
    });

    return Promise.all(tokenDetailsPromises);
  };

  return { getTokenDetails };
};

export default useCoinGecko;
