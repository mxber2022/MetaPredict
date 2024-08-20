"use client"

import { useWriteContract } from 'wagmi'
import { Address, parseEther } from 'viem';
import { abi } from './abi'
import myconfig from '../../../myconfig.json'

function TokenApprove() {

    const tokenContract = "0xdE0D84e73CA37ee5bA156C50E03534609351c81f"
    const approveTo = "0x7E1F4DC002b0FE69Cc6410AfD91444E301e42B09"
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