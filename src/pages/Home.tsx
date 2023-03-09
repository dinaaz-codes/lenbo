import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { ActionCard } from "../components/ActionCard";
import StatCard from "../components/StatCard";
import useAave, { ActionType, ReserveData, UserData } from "../hooks/useAave";
import useWeb3 from "../hooks/useWeb3";

const Home = () => {
  const [reserves, setReserves] = useState<ReserveData[]>([]);
  const [userData, setUserData] = useState<UserData>();
  const { getReserves, getUserAccountData, supply, borrow, repay, withdraw } = useAave();
  const { chainId, activeAccount } = useWeb3();
  const [toggle, setToggle] = useState<boolean>(false);

  const toggleRefresh = () => {
    setTimeout(() => setToggle(!toggle), 5000)
  };

  useEffect(() => {
    if (activeAccount && chainId) {
      getReserves(chainId, activeAccount).then((data) => {
        console.log(data);
        setReserves(data);
      });
      getUserAccountData(chainId, activeAccount ?? "").then((data) => setUserData(data))
    }
  }, [chainId, activeAccount, toggle]);

  return (
    <Container>
      <Row>
        <StatCard
          borrowCapacity={userData?.borrowCapacity ?? 0}
          totalBalance={userData?.balance ?? 0}
          totalCollateral={userData?.totalCollateral ?? 0}
          totalDebt={userData?.totalDebt ?? 0}
        />
      </Row>
      <Row className="mt-3">
        <Col>
          <ActionCard
            toggleRefresh={toggleRefresh}
            action={withdraw}
            actionType={ActionType.WITHDRAW}
            chainId={chainId ?? 0}
            reserves={reserves.filter((reserve) => reserve.suppliedAmount > 0).filter((reserve) => !["matic", "ether"].includes(reserve.symbol.toLowerCase()))}
            title="Supplied" userAddress={activeAccount ?? ""}
          />
        </Col>
        <Col>
          <ActionCard
            toggleRefresh={toggleRefresh}
            action={repay}
            actionType={ActionType.REPAY}
            chainId={chainId ?? 0}
            reserves={reserves.filter((reserve) => reserve.debtAmount > 0)}
            title="Borrowed"
            userAddress={activeAccount ?? ""}
          />
        </Col>
      </Row>

      <Row className="mt-3">
        <Col>
          <ActionCard
            toggleRefresh={toggleRefresh}
            action={supply}
            actionType={ActionType.SUPPLY}
            chainId={chainId ?? 0}
            reserves={reserves.filter((reserve) => reserve.balance > 0)}
            title="Supply"
            userAddress={activeAccount ?? ""}
          />
        </Col>
        <Col>
          <ActionCard
            toggleRefresh={toggleRefresh}
            action={borrow}
            actionType={ActionType.BORROW}
            chainId={chainId ?? 0}
            reserves={reserves}
            title="Borrow"
            userAddress={activeAccount ?? ""}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
