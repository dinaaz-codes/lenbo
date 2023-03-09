import { InterestRate } from "@aave/contract-helpers";
import { useState } from "react";
import { Col, Row, Spinner, Table } from "react-bootstrap";
import { ActionType, ReserveData } from "../hooks/useAave";
import { AssetRow } from "./AssetRow";

type Props = {
  reserves: ReserveData[];
  actionType: ActionType;
  chainId: number;
  userAddress: string
  action: any;
  toggleRefresh: () => void;
};

export const AssetTable = ({ reserves, actionType, chainId, userAddress, action, toggleRefresh }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onActionClicked = (reserveAddress: string, amount: number, interestMode?: InterestRate, aTokenAddress?: string) => {
    let response;

    setIsLoading(true);

    switch (actionType) {
      case ActionType.SUPPLY:
        response = action(chainId, userAddress, reserveAddress, amount)
        break;
      case ActionType.BORROW:
        response = action(chainId, userAddress, reserveAddress, amount, interestMode)
        break;
      case ActionType.REPAY:
        response = action(chainId, userAddress, reserveAddress, amount, interestMode)
        break;
      case ActionType.WITHDRAW:
        response = action(chainId, userAddress, reserveAddress, amount, aTokenAddress)
        break;
      default: throw new Error("Invalid action type.");
    }

    response
      .then((data: any) => {
        console.log(data);
        toggleRefresh()
      })
      .catch((error: Error) => {
        console.log(error)
      })
      .finally(() => setIsLoading(false));
  }
  return (
    <>
      {isLoading ? <>
        <div style={{ position: "fixed", height: "100vh", width: "100vw", background: "rgba(0,0,0,0.1)", zIndex: 5, top: 0, left: 0 }}>
          <Row className="justify-content-center mt-5">
            <Col sm={2} className="text-center mt-5">
              <Spinner animation="border" variant="light" />
              <p>Please wait...</p>
            </Col>
          </Row>
        </div>
      </>
        : <Table striped variant="dark">
          <tbody>
            {reserves.map((reserve) => <AssetRow action={onActionClicked} key={reserve.name} actionType={actionType} reserve={reserve} />)}
          </tbody>
        </Table>}
    </>
  );
}