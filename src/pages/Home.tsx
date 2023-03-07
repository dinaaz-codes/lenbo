import { useEffect } from "react";
import useAave from "../hooks/useAave";
import useCoinGecko from "../hooks/useCoinGecko";

const Home = () => {
  const { getReserves } = useAave();
  const {getTokenDetails} = useCoinGecko()

  useEffect(() => {
  }, []);

  return (
    <>
      <h1>Welcome to Lenbo!</h1>;
    </>
  );
};

export default Home;
