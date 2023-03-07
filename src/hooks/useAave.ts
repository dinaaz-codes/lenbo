import { useContext } from "react";
import { networks } from "../config/networks";
import Web3Context from "../context/Web3Context";
import AavePoolAbi from "../abi/poolAbi.json";
import {
  EthereumTransactionTypeExtended,
  Pool,
  InterestRate,
} from "@aave/contract-helpers";
import { providers, BigNumber } from "ethers";
import { getProvider } from "../utils/web3";

type TransactionParamType = {
  provider: providers.Web3Provider;
  tx: EthereumTransactionTypeExtended;
};

enum RepayTypes {
  WITH_A_TOKENS = "repay_with_a_tokens",
  WITH_PERMIT = "repay_with_permit",
  STANDARD = "repay",
}

const useAave = () => {
  const web3 = useContext(Web3Context);

  const getReserves = async (chainId: number) => {
    const network = networks.find((network) => network.chainId == chainId);
    if (!network) throw new Error("Unsupported Network");

    if (network.isTestnet) return network.reserves;

    const poolContract = new web3.eth.Contract(
      AavePoolAbi as any,
      network.poolAddress
    );

    const reservesList = await poolContract.methods.getReservesList().call();
    console.log(reservesList);
    return reservesList;
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
      const network = networks.find((network) => network.chainId == chainId);

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
      const network = networks.find((network) => network.chainId == chainId);

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
      const network = networks.find((network) => network.chainId == chainId);

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
      const network = networks.find((network) => network.chainId == chainId);

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

      //check with dom about txs
      return await submitTransaction({
        provider: new providers.Web3Provider(getProvider()),
        tx: txs[0],
      });
    } catch (err) {
      console.log("error in withdraw Transaction =>", err);
      throw err;
    }
  };

  return { getReserves, borrow, repay, withdraw, supply };
};

export default useAave;
