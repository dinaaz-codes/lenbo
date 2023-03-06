import React from "react";
import "./App.css";
import Nav from "./components/Nav";
import { AppRoutes } from "./routes/AppRoutes";

declare global {
  interface Window {
    ethereum: any;
  }
}

function App() {
  return (
    <div className="App">
      <AppRoutes/>
    </div>
  );
}

export default App;
