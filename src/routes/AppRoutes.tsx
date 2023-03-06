import { Route, Routes } from "react-router-dom";
import { withAuthentication } from "./withAuthentication";
import Home from "../pages/Home";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route
        path="/allowance"
        element={withAuthentication(<Home />)}
      ></Route>
    </Routes>
  );
};