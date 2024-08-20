import { useWriteContract } from 'wagmi';
import { abi } from '../../abi';
import myconfig from '../../myconfig.json';
import { Address, parseEther } from 'viem';

export const placebet = async (marketId: string, outcome: string) => {
    const { writeContract } = useWriteContract();
    console.log(`Market ID: ${marketId}, Outcome: ${outcome}`);

    try {
        await writeContract({
            abi,
            address: myconfig.CONTRACT_ADDRESS_BASE as Address,
            functionName: 'placeBet',
            args: [
                marketId,
                outcome
            ],
            value: parseEther('0.001')
        });
        console.log('Bet placed successfully');
    } catch (err) {
        console.error('Error placing bet:', err);
    }
};
