import { useContext } from "react";
import { networks } from "../config/networks";
import Web3Context from "../context/Web3Context";
import AavePoolAbi from "../abi/poolAbi.json";
import ERC20Abi from "../abi/Erc20.json";
import AaveOracleAbi from "../abi/AaveOracleAbi.json";
import PoolDataProviderAbi from "../abi/PoolDataProviderAbi.json";

import {
  EthereumTransactionTypeExtended,
  Pool,
  InterestRate,
} from "@aave/contract-helpers";
import { providers, BigNumber } from "ethers";
import { getProvider } from "../utils/web3";
import { tokenLogos } from "../data/tokenLogo";
import Web3 from "web3";

type TransactionParamType = {
  provider: providers.Web3Provider;
  tx: EthereumTransactionTypeExtended;
};

enum RepayTypes {
  WITH_A_TOKENS = "repay_with_a_tokens",
  WITH_PERMIT = "repay_with_permit",
  STANDARD = "repay",
}

export type ReserveData = {
  name: string;
  address: string;
  decimal: number;
  balance: number;
  logoUrl: string;
  networkId: number;
  symbol: string;
  debtAmount: number;
  suppliedAmount: number;
  aTokenAddress: string;
};

export type UserData = {
  borrowCapacity: number;
  totalCollateral: number;
  totalDebt: number;
  balance: number;
};

export enum ActionType {
  SUPPLY,
  BORROW,
  REPAY,
  WITHDRAW,
}

type CoinData = {
  name: string;
  address: string;
  decimal: number;
  symbol: string;
  logoUrl: string;
  networkId: number;
};

const useAave = () => {
  const web3 = useContext(Web3Context);

  const getTokenDetails = async (chainId: number, reserves: string[]) => {
    const network = networks.find((network) => network.chainId === chainId);
    if (!network) throw new Error("Unsupported Network");

    return await Promise.all(
      reserves.map(async (reserve) => {
        const provider = network.rpcUrl ? new Web3(network.rpcUrl) : web3;
        const erc20Contract = new provider.eth.Contract(
          ERC20Abi as any,
          reserve
        );
        const name = await erc20Contract.methods.name().call();
        const symbol = await erc20Contract.methods.symbol().call();
        const decimal = await erc20Contract.methods.decimals().call();
        const logo =
          tokenLogos.find(
            (token) => token.symbol.toLowerCase() === symbol.toLowerCase()
          )?.url ?? "";
        return {
          name,
          address: reserve,
          decimal: +decimal,
          logoUrl: logo,
          networkId: chainId,
          symbol,
        } as CoinData;
      })
    );
  };

  const getReserves = async (chainId: number, account: string) => {
    const network = networks.find((network) => network.chainId === chainId);
    if (!network) throw new Error("Unsupported Network");

    const poolContract = new web3.eth.Contract(
      AavePoolAbi as any,
      network.poolAddress
    );

    const reservesList = await poolContract.methods.getReservesList().call();
    const coinsData = await getTokenDetails(
      network.chainId,
      reservesList as string[]
    );
    const coinsWithBalancePromises = coinsData.map(
      async (coin): Promise<ReserveData> => {
        const provider = network.rpcUrl ? new Web3(network.rpcUrl) : web3;
        const erc20Contract = new provider.eth.Contract(
          ERC20Abi as any,
          coin.address
        );
        const balance = await erc20Contract.methods.balanceOf(account).call();
        const poolDataProviderContract = new provider.eth.Contract(
          PoolDataProviderAbi as any,
          network.poolDataProviderAddress
        );
        const userReserveData = await poolDataProviderContract.methods
          .getUserReserveData(coin.address, account)
          .call();

        const aTokenAddress = (await poolDataProviderContract.methods
          .getReserveTokensAddresses(coin.address)
          .call()).aTokenAddress;

        const { currentStableDebt, currentVariableDebt, currentATokenBalance } =
          userReserveData;

        return {
          ...coin,
          balance: +balance / 10 ** coin.decimal,
          debtAmount:
            (+currentStableDebt + +currentVariableDebt) / 10 ** coin.decimal,
          suppliedAmount: +currentATokenBalance / 10 ** coin.decimal,
          aTokenAddress,
        };
      }
    );

    const coinsWithBalances = await Promise.all(coinsWithBalancePromises);

    const wrappedTokenData = coinsWithBalances.find(
      (coin) =>
        coin.address.toLowerCase() === network.wrappedToken.toLowerCase()
    );

    const nativeTokenData: ReserveData = {
      address: network.wrappedToken,
      balance: +web3.utils.fromWei(await web3.eth.getBalance(account), "ether"),
      decimal: network.decimal,
      logoUrl: network.nativeTokenLogo,
      name: network.nativeToken,
      networkId: network.chainId,
      symbol: network.nativeTokenSymbol,
      debtAmount: wrappedTokenData?.debtAmount ?? 0,
      suppliedAmount: wrappedTokenData?.suppliedAmount ?? 0,
      aTokenAddress: wrappedTokenData?.aTokenAddress ?? "",
    };

    return [nativeTokenData, ...coinsWithBalances];
  };

  const getUserAccountData = async (chainId: number, account: string) => {
    console.log(chainId, account);
    const network = networks.find((network) => network.chainId === chainId);
    if (!network) throw new Error("Unsupported Network");

    const poolContract = new web3.eth.Contract(
      AavePoolAbi as any,
      network.poolAddress
    );
    const userData = await poolContract.methods
      .getUserAccountData(account)
      .call();

    const oracleContract = new web3.eth.Contract(
      AaveOracleAbi as any,
      network.oracleAddress
    );
    const baseDecimal = +(await oracleContract.methods
      .BASE_CURRENCY_UNIT()
      .call());
    const totalCollateral = +userData.totalCollateralBase / baseDecimal;
    return {
      borrowCapacity: +userData.availableBorrowsBase / baseDecimal,
      totalCollateral: totalCollateral,
      totalDebt: +userData.totalDebtBase / baseDecimal,
      balance: totalCollateral,
    } as UserData;
  };

  const submitTransaction = async (transactionParams: TransactionParamType) => {
    try {
      const extendedTxData = await transactionParams.tx.tx();
      const { from, ...txData } = extendedTxData;
      const signer = transactionParams.provider.getSigner(from);
      return await signer.sendTransaction({
        ...txData,
        value: txData.value ? BigNumber.from(txData.value) : undefined,
      });
    } catch (err) {
      console.log("error in submitTransaction =>", err);
      throw err;
    }
  };

  const getPoolObj = (
    provider: any,
    poolAddress: string,
    wethGatewayAddress: string
  ): Pool => {
    return new Pool(provider, {
      POOL: poolAddress,
      WETH_GATEWAY: wethGatewayAddress,
    });
  };

  //borrow
  const borrow = async (
    chainId: number,
    borrowerAddress: string,
    reserve: string,
    amount: string,
    interestRateMode: InterestRate
  ) => {
    try {
      const network = networks.find((network) => network.chainId === chainId);

      if (!network?.poolAddress) throw new Error("Invalid network");

      const poolObj = getPoolObj(
        new providers.Web3Provider(getProvider()),
        network.poolAddress,
        network.wethGateway
      );

      const txs: EthereumTransactionTypeExtended[] = await poolObj.borrow({
        user: borrowerAddress,
        reserve,
        amount: amount,
        interestRateMode,
      });

      console.log("transactions", txs);

      return await submitTransaction({
        provider: new providers.Web3Provider(getProvider()),
        tx: txs[0],
      });
    } catch (err) {
      console.log("error in borrowTransaction =>", err);
      throw err;
    }
  };

  //lend
  const supply = async (
    chainId: number,
    depositorsAddress: string,
    reserve: string,
    amount: string
  ) => {
    try {
      const network = networks.find((network) => network.chainId === chainId);

      if (!network?.poolAddress) throw new Error("Invalid network");

      const poolObj = getPoolObj(
        new providers.Web3Provider(getProvider()),
        network.poolAddress,
        network.wethGateway
      );

      const txs: EthereumTransactionTypeExtended[] = await poolObj.supply({
        user: depositorsAddress,
        reserve,
        amount: amount,
      });
      console.log("tsx =>", txs);
      return await submitTransaction({
        provider: new providers.Web3Provider(getProvider()),
        tx: txs[0],
      });
    } catch (err) {
      console.log("error in supply Transaction =>", err);
      throw err;
    }
  };

  //repay
  const repay = async (
    chainId: number,
    depositorsAddress: string,
    reserve: string,
    amount: string,
    interestRateMode: InterestRate,
    repayType: RepayTypes = RepayTypes.STANDARD
  ) => {
    try {
      const network = networks.find((network) => network.chainId === chainId);

      if (!network?.poolAddress) throw new Error("Invalid network");

      const poolObj = getPoolObj(
        new providers.Web3Provider(getProvider()),
        network.poolAddress,
        network.wethGateway
      );

      let txs: EthereumTransactionTypeExtended[] = [];

      switch (repayType) {
        case RepayTypes.WITH_A_TOKENS:
          break;
        case RepayTypes.WITH_PERMIT:
          break;
        case RepayTypes.STANDARD:
          txs = await poolObj.repay({
            user: depositorsAddress,
            reserve,
            interestRateMode,
            amount: amount,
          });
          break;
        default:
          break;
      }

      return await submitTransaction({
        provider: new providers.Web3Provider(getProvider()),
        tx: txs[0],
      });
    } catch (err) {
      console.log("error in repay Transaction =>", err);
      throw err;
    }
  };

  //withdraw
  const withdraw = async (
    chainId: number,
    withdrawToAddress: string,
    reserve: string,
    amount: string,
    aTokenAddress: string
  ) => {
    try {
      const network = networks.find((network) => network.chainId === chainId);

      if (!network?.poolAddress) throw new Error("Invalid network");

      const poolObj = getPoolObj(
        new providers.Web3Provider(getProvider()),
        network.poolAddress,
        network.wethGateway
      );

      const txs: EthereumTransactionTypeExtended[] = await poolObj.withdraw({
        user: withdrawToAddress,
        reserve,
        amount: amount,
        aTokenAddress,
      });

      return await submitTransaction({
        provider: new providers.Web3Provider(getProvider()),
        tx: txs[0],
      });
    } catch (err) {
      console.log("error in withdraw Transaction =>", err);
      throw err;
    }
  };

  return { getReserves, borrow, repay, withdraw, supply, getUserAccountData };
};

export default useAave;
