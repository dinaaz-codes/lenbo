import useWeb3 from "../hooks/useWeb3";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

type Props = {
  isConnected:boolean,
  onClickHandler:()=>Promise<void>
}

const ConnectWalletButton = ({isConnected , onClickHandler}:Props) => {
  return (
    <button disabled={isConnected} onClick={onClickHandler}>
      <FontAwesomeIcon  icon={faCircle} color= {isConnected? "green":"red"}/> Connect
    </button>
  );
};

export default ConnectWalletButton;