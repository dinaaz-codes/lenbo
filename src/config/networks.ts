type TokenType = {
  name: string;
  address: string;
};

type NetworkType = {
  chainId: number;
  name: string;
  poolAddress: string;
  nativeToken: string;
  decimal: number;
  isTestnet: boolean;
  wethGateway: string;
  rpcUrl?: string;
  reserves?: TokenType[];
};

export const networks: NetworkType[] = [
  {
    chainId: 1,
    name: "ethereum",
    poolAddress: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2",
    nativeToken: "ether",
    decimal: 18,
    isTestnet: false,
    wethGateway: "0xD322A49006FC828F9B5B37Ab215F99B4E5caB19C",
  },
  {
    chainId: 137,
    name: "polygon",
    poolAddress: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
    nativeToken: "matic",
    decimal: 18,
    isTestnet: false,
    wethGateway: "0x1e4b7A6b903680eab0c5dAbcb8fD429cD2a9598c",
  },
  {
    chainId: 5,
    name: "goerli",
    poolAddress: "0xCE5f067F3D0AEe076EB6122c8989A48f82f2499a",
    nativeToken: "goerliEth",
    decimal: 18,
    isTestnet: true,
    wethGateway: "0x2A498323aCaD2971a8b1936fD7540596dC9BBacD",
    reserves: [
      {
        name: "DAI-TestnetMintableERC20-Aave",
        address: "0xBa8DCeD3512925e52FE67b1b5329187589072A55",
      },
      {
        name: "LINK-TestnetMintableERC20-Aave",
        address: "0xe9c4393a23246293a8D31BF7ab68c17d4CF90A29",
      },
      {
        name: "USDC-TestnetMintableERC20-Aave",
        address: "0x65aFADD39029741B3b8f0756952C74678c9cEC93",
      },
      {
        name: "WBTC-TestnetMintableERC20-Aave",
        address: "0x45AC379F019E48ca5dAC02E54F406F99F5088099",
      },
      {
        name: "USDT-TestnetMintableERC20-Aave",
        address: "0x2E8D98fd126a32362F2Bd8aA427E59a1ec63F780",
      },
      {
        name: "AAVE-TestnetMintableERC20-Aave",
        address: "0x8153A21dFeB1F67024aA6C6e611432900FF3dcb9",
      },
      {
        name: "EURS-TestnetMintableERC20-Aave",
        address: "0xBC33cfbD55EA6e5B97C6da26F11160ae82216E2b",
      },
      {
        name: "WETH-TestnetMintableERC20-Aave",
        address: "0xCCB14936C2E000ED8393A571D15A2672537838Ad",
      },
    ],
  },
];
