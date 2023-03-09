import axios from "axios";

type CoinDetailsResponse = {
  id: string;
  symbol: string;
  name: string;
  asset_platform_id: string;
  platforms: {[key: string]: any};
  detail_platforms: {[key: string]: any};
  image: {
    thumb: string;
  }
};

type CoinData = {
  name: string;
  address: string;
  decimal: number;
  symbol: string;
  logoUrl: string;
  networkId: number;
}


const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";

const useCoinGecko = () => {
  const getTokenDetails = async (chainId: number, tokenAddresses: string[]): Promise<CoinData[]> => {
    const tokenDetailsPromises = tokenAddresses.map(async(tokenAddress) => {
      return (await axios.get<CoinDetailsResponse>(
        `${COINGECKO_BASE_URL}/coins/${chainId}/contract/${tokenAddress}`
      )).data;
    });

    return (await Promise.all(tokenDetailsPromises)).map((token) => ({
      name: token.name,
      decimal: token.detail_platforms[token.asset_platform_id]["decimal_place"],
      address: token.detail_platforms[token.asset_platform_id]["contract_address"],
      logoUrl: token.image.thumb,
      networkId: chainId,
      symbol: token.symbol,
    }));
  };

  return { getTokenDetails };
};

export default useCoinGecko;
