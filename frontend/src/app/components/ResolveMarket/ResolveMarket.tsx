"use client"

import { useWriteContract } from 'wagmi'
import { Address, parseEther } from 'viem';
import { abi } from '../../../abi'
import myconfig from '../../../myconfig.json'

function ResolveMarket() {

    const { writeContract, isSuccess, data, status, error } = useWriteContract()

    //@ts-ignore
    const ResolveMarket = async (event) => {
        event.preventDefault();
        writeContract({ 
            abi,
            address: myconfig.CONTRACT_ADDRESS_BASE as Address,
            functionName: 'resolveMarket', 
            args: [],
         })
    }; 

    return(
        <>
            <button onClick={ResolveMarket}>Resolve Market</button>
        </>
    )
}

export default ResolveMarket;