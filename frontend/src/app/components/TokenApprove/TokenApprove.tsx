"use client"

import { useWriteContract } from 'wagmi'
import { Address, parseEther } from 'viem';
import { abi } from './abi'
import myconfig from '../../../myconfig.json'

function TokenApprove() {

    const tokenContract = "0x0ee7F43c91Ca54DEEFb58B261A454B9E8b4FEe8B"
    const approveTo = "0xAaa906c8C2720c50B69a5Ba54B44253Ea1001C98"
    const amount = 19e17;    
    
    const { writeContract, isSuccess, data: writeContractData, status: writeContractStatus, error } = useWriteContract()



    //@ts-ignore
    const approveMyToken = async (event) => {
        event.preventDefault();
        try{
            console.log("hello2")
            writeContract({ 
                abi,
                address: tokenContract as Address,
                functionName: 'approve', 
                args: [approveTo as Address, parseEther("10000000")]
             })
        }
        catch(error) {
            console.log(writeContractStatus)
        }
       
    }; 
    console.log(error)

    return(
        <>
            <button onClick={approveMyToken}>approve</button>
        </>
    )
}

export default TokenApprove;