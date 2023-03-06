import { useEffect } from "react";
import ConnectWalletButton from "./ConnectWalletButton";
import useWeb3 from "../hooks/useWeb3";
import { Link } from "react-router-dom";

const Nav = () => {
  const { isConnected, connectWallet } = useWeb3();

  useEffect(() => {
    console.log(isConnected);
  }, [isConnected]);

  const getNavItems = () => {
    return (
      <>
        <li>
          <Link to="/">Home </Link>
        </li>
        <li>
          <Link to="/allowance">Allowance</Link>
        </li>
      </>
    );
  };

  return (
    <ul>
      <ConnectWalletButton
        isConnected={isConnected}
        onClickHandler={connectWallet}
      />
      {isConnected && getNavItems()}
    </ul>
  );
};

export default Nav;