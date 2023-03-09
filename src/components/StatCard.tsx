import { Button, Card } from "react-bootstrap";

type Props = {
  totalDebt: number;
  totalBalance: number;
  totalCollateral: number;
  borrowCapacity: number;
};

const StatCard = ({totalBalance, borrowCapacity, totalCollateral, totalDebt}: Props) => {
  return (
    <Card className="bg-dark text-white mt-3">
      <Card.Body>
        <Card.Title>Account Summary</Card.Title>
        <hr/>
        <Card.Text className="mt-4">
          Balance: <b>${totalBalance.toFixed(2)}</b>
        </Card.Text>
        <Card.Text className="mt-4">
          Total Collateral: <b>${totalCollateral.toFixed(2)}</b>
        </Card.Text>
        <Card.Text className="mt-4">
          Borrow Limit: <b>${borrowCapacity.toFixed(2)}</b>
        </Card.Text>
        <Card.Text className="mt-4">
          Total Debt: <b>${totalDebt.toFixed(2)}</b>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default StatCard;
