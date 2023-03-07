import { useEffect } from "react";
import { Container, Row } from "react-bootstrap";
import StatCard from "../components/StatCard";
import useAave from "../hooks/useAave";
import useCoinGecko from "../hooks/useCoinGecko";

const Home = () => {
  const { getReserves, supply } = useAave();
  const { getTokenDetails } = useCoinGecko();
  const isConnected = false;

  useEffect(() => {
    supply(
      5,
      "0xc8EEb13D3765280f97fA1b153F166D6F840D6165",
      "0xCCB14936C2E000ED8393A571D15A2672537838Ad",
      (10**15).toString()
    );
  }, []);

  return (
    <Container>
      <Row>
        <StatCard />
      </Row>
      <h1>Welcome to Lenbo!</h1>;
    </Container>
  );
};

export default Home;
