import { ActionType, ReserveData } from "../hooks/useAave";
import { Image, Button, Form } from 'react-bootstrap'
import { useState } from "react";
import { InterestRate } from "@aave/contract-helpers";

type Props = {
    reserve: ReserveData;
    actionType: ActionType;
    action: (reserveAddress: string, amount: number, interestMode?: InterestRate, aTokenAddress?:string) => void;
};

const getButtonText = (actionType: ActionType) => {
    switch (actionType) {
        case ActionType.SUPPLY: return "supply";
        case ActionType.BORROW: return "borrow";
        case ActionType.WITHDRAW: return "withdraw";
        case ActionType.REPAY: return "repay";
    }
}

const getBalanceToShow = (actionType: ActionType, reserve: ReserveData) => {
    switch (actionType) {
        case ActionType.SUPPLY: return reserve.balance;
        case ActionType.WITHDRAW: return reserve.suppliedAmount;
        case ActionType.REPAY: return reserve.debtAmount;
        default: return 0;
    }
}

export const AssetRow = ({ reserve, actionType, action }: Props) => {
    const [amount, setAmount] = useState<number>();
    const [showInput, setShowInput] = useState<boolean>(false);

    const handleClick = () => {
        console.log(actionType, amount)
        if (!showInput) {
            setShowInput(true);
            return;
        }
        if (!amount) return;
        if (actionType === ActionType.SUPPLY) {
            action(reserve.address, amount);
        }
        else if (actionType === ActionType.BORROW || actionType === ActionType.REPAY) {
            action(reserve.address, amount, InterestRate.Variable);
        }
        else if (actionType === ActionType.WITHDRAW) {
            action(reserve.address, amount, InterestRate.None, reserve.aTokenAddress);
        }
    }

    const handleAmountChange = (e: any) => {
        const value = +e.target.value;

        if (actionType === ActionType.WITHDRAW) {
            if (!value)
                setAmount(undefined);
            else if (value > reserve.suppliedAmount)
                setAmount(reserve.suppliedAmount);
            else if (value < 0)
                setAmount(0);
            else
                setAmount(value);
        }
        else if(actionType !== ActionType.BORROW){
            if (!value)
                setAmount(undefined);
            else if (value > reserve.balance)
                setAmount(reserve.balance);
            else if (value < 0)
                setAmount(0);
            else
                setAmount(value);
        }
        else{
            setAmount(value);
        }
    }

    return (
        <tr>
            <td><Image rounded src={reserve.logoUrl} /></td>
            <td>{reserve.name}({reserve.symbol})</td>
            {actionType !== ActionType.BORROW && <td>{getBalanceToShow(actionType, reserve).toFixed(4)}</td>}
            {showInput && <td><Form.Control placeholder="amount" type="number" value={amount} onChange={handleAmountChange}></Form.Control></td>}
            <td><Button variant="light" onClick={handleClick}>{getButtonText(actionType)}</Button></td>
        </tr>
    )
}