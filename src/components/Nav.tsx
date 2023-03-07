import { useEffect } from "react";
import ConnectWalletButton from "./ConnectWalletButton";
import useWeb3 from "../hooks/useWeb3";
import { Link } from "react-router-dom";
import { Navbar, Container, Nav as BNav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleDollarToSlot } from "@fortawesome/free-solid-svg-icons";

const Nav = () => {
  const { isConnected, connectWallet } = useWeb3();

  useEffect(() => {
    console.log(isConnected);
  }, [isConnected]);

  const getNavItems = () => {
    return (
      <BNav className="me-auto">
        <BNav.Link href="light">
          <Link to="/">Home</Link>
        </BNav.Link>
        <BNav.Link>
          <Link to="/allowance"></Link>
        </BNav.Link>
      </BNav>
    );
  };

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>
            <FontAwesomeIcon icon={faCircleDollarToSlot} /> <b>Lenbo</b>
          </Navbar.Brand>
            <ConnectWalletButton
              isConnected={isConnected}
              onClickHandler={connectWallet}
            />
        </Container>
      </Navbar>
    </>
  );
};

export default Nav;
