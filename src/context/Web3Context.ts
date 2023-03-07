import React from "react";
import Web3 from "web3";
import { web3 } from "../utils/web3";

const Web3Context = React.createContext<Web3>(web3);

export default Web3Context;
