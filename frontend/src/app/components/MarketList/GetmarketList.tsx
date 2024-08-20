"use client";

import React, { useCallback, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useWriteContract } from 'wagmi';
import { abi } from '../../../abi';
import myconfig from '../../../myconfig.json';
import { Address } from 'viem';
import { parseEther } from 'viem';
import "./MarketList.css";
import Image from "next/image";
import GetMarketStatus from './GetMarketStatus';
import TransactionStatus from '../TransactionStatus/TransactionStatus';
import CommentPop from '../Comment/CommentPop';
import WithdrawWinning from '../WithdrawWinning/WithdrawWinning';

const MY_QUERY = gql`
  query MyQuery {
    marketCreateds {
      marketId
      outcomes
      question
      imageUri
    }
  }
`;

interface MarketCreated {
  marketId: string;
  outcomes: string; // outcomes is a string
  question: string;
  imageUri: string;
}

interface MyQueryData {
  marketCreateds: MarketCreated[];
}

function GetmarketList() {
  const [selectedMarket, setSelectedMarket] = useState<MarketCreated | null>(null);
  const { loading, error, data } = useQuery<MyQueryData>(MY_QUERY);
  const { writeContract, isSuccess, data: writeContractData, status } = useWriteContract(); // create market
  const [amount, setAmount] = useState('');

  const handleButtonClick = useCallback(
    async (marketId: string, outcome: string, amount: string, index: number) => {
      try {
        await writeContract({
          abi,
          address: myconfig.CONTRACT_ADDRESS_BASE as Address,
          functionName: 'placeBet',
          args: [marketId, index],
          value: parseEther(amount)
        });
      } catch (error) {
        console.error("Error placing bet:", error);
      }
    },
    [writeContract]
  );

  console.log("isSuccess: ", isSuccess);
  console.log("writeContractData: ", writeContractData);
  console.log("status", status);

  if (loading) return <h3>Loading...</h3>;
  if (error) return <h3>Error :(</h3>;

  const closePopup = () => {
    setSelectedMarket(null);
  };

  const handleQuestionClick = (market: MarketCreated) => {
    setSelectedMarket(market);
  };

  return (
    <section className='marketList'>
      <div className='marketList__container'>
        <h2>Market List</h2>
        <div className='marketList__grid'>
          {data?.marketCreateds.map((market) => {
            const isValidImageUrl = market.imageUri.startsWith('http://') || market.imageUri.startsWith('https://');
            return (
              <div key={market.marketId} className='marketList__card'>
                <div className='betAmount'>
                  <div>
                    {isValidImageUrl ? (
                      <Image src={market.imageUri.concat('?raw=true')} alt="Market Image" width={50} height={50} />
                    ) : (
                      <div className='placeholderImage' style={{ width: 50, height: 50, backgroundColor: 'gray' }} />
                    )}
                  </div>
                  <div className='amountText'>
                    <h3 className="market-question" onClick={() => handleQuestionClick(market)}>{market.question}</h3>
                  </div>
                </div>
                <div className='betAmount betAmount-top'>
                  <div>
                    <h3>Amount</h3>
                  </div>
                  <div className='amountText'>
                    <input
                      type="number"
                      onChange={(e) => setAmount(e.target.value)}
                      required
                      style={{ backgroundColor: 'black', color: 'white', border: '1px solid #ccc', padding: '5px', borderRadius: '5px' }}
                    />
                  </div>
                </div>
                <div className='marketList__cardBtns'>
                  {market.outcomes.split(',').map((outcome, index) => (
                    <button key={index} onClick={() => handleButtonClick(market.marketId, outcome, amount, index)}>
                      {outcome}
                    </button>
                  ))}
                </div>
                <div className='amount-bottom'>
                  <GetMarketStatus marketId={Number(market.marketId)} />
                </div>
                <WithdrawWinning MarketId={market.marketId} />
              </div>
            );
          })}
        </div>
      </div>
      {selectedMarket && <CommentPop market={selectedMarket} onClose={closePopup} />}
      <TransactionStatus status={status} writeContractData={writeContractData} />
    </section>
  );
}

export default GetmarketList;
