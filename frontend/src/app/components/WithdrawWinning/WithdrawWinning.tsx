"use client"

import { useWriteContract } from 'wagmi'
import { Address, parseEther } from 'viem';
import { abi } from '../../../abi'
import myconfig from '../../../myconfig.json'
import "./WithdrawWinning.css"
import TransactionStatus from '../TransactionStatus/TransactionStatus';

function WithdrawWinning(MarketId: any) {

    const { writeContract, isSuccess, data, status, error } = useWriteContract()

    //@ts-ignore
    const WWinning = async (event) => {
        event.preventDefault();
        writeContract({ 
            abi,
            address: myconfig.CONTRACT_ADDRESS_BASE as Address,
            functionName: 'withdrawWinnings', 
            args: [MarketId.MarketId],
         })
    }; 

    console.log("error", error);

    return(
        <>
            <div className="WithdrawWinning">
                <button onClick={WWinning}>WithdrawWinning</button>
            </div>
            <TransactionStatus status={status} writeContractData={data}/>
        </>
    )
}

export default WithdrawWinning;