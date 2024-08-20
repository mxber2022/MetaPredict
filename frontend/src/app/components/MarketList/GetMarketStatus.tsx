import { useReadContract } from 'wagmi';
import { abi } from '../../../abi';
import myconfig from '../../../myconfig.json';
import { Address } from 'viem';
import React from 'react';
import { formatUnits, parseUnits } from 'viem';

interface GetMarketStatusProps {
    marketId: string | number;
}

const GetMarketStatus: React.FC<GetMarketStatusProps> = ({ marketId }) => {
    const { data, isError, isLoading } = useReadContract({
        abi,
        address: myconfig.CONTRACT_ADDRESS_BASE as Address,
        functionName: 'getMarketDetails',
        args: [marketId],
    });

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading market status</div>;

    //@ts-ignore
    const totalPool = formatUnits(data?.[5], 18);
    //@ts-ignore
    const marketstaus = data?.[3];
    
    return (
        <div>
            <div className='betAmount'>
                <div>
                    <h4>Total Pool</h4>
                </div>
                <div className='amountText'>
                    <h4>{String(totalPool)} ETH</h4>
                </div>
            </div>

            <div className='betAmount'>
                <div >
                    <h4>Market Resolved</h4>
                </div>
                <div className='amountText'>
                    <h4>{String(marketstaus)}</h4>
                </div>
            </div>
            
        </div>
    );
}

export default GetMarketStatus;