import { Card } from "react-bootstrap";
import { ActionType, ReserveData } from "../hooks/useAave";
import { AssetTable } from "./AssetTable";

type Props = {
  title: string;
  reserves: ReserveData[];
  actionType: ActionType;
  chainId: number;
  userAddress: string;
  action: any;
  toggleRefresh: () => void;
};

export const ActionCard = ({
  title,
  chainId,
  userAddress,
  reserves,
  action,
  actionType,
  toggleRefresh,
}: Props) => {
  return (
    <Card className="bg-dark text-white">
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <AssetTable
          toggleRefresh={toggleRefresh}
          chainId={chainId}
          userAddress={userAddress}
          reserves={reserves}
          actionType={actionType}
          action={action}
        />
      </Card.Body>
    </Card>
  );
};
