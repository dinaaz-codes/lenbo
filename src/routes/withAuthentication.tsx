import React from "react";
import useWeb3 from "../hooks/useWeb3";
import ErrorPage, { ErrorType, HttpStatusCode } from "../shared/ErrorPage";

export const withAuthentication = (
  Component: React.ReactNode
): React.ReactNode => {
  return (() => {
    const { isConnected } = useWeb3();

    return isConnected ? (
      Component
    ) : (
      <ErrorPage
        statusCode={HttpStatusCode.FORBIDDEN}
        errorType={ErrorType.FORBIDDEN}
      ></ErrorPage>
    );
  })();
};
