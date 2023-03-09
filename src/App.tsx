import "./App.css";
import Nav from "./components/Nav";
import Web3Context from "./context/Web3Context";
import { AppRoutes } from "./routes/AppRoutes";
import { web3 } from "./utils/web3";

declare global {
  interface Window {
    ethereum: any;
  }
}

function App() {

  return (
    <Web3Context.Provider value={web3}>
        <div className="App">
      <Nav/>
      <AppRoutes/>
    </div>
    </Web3Context.Provider>

  );
}

export default App;
