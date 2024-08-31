"use client";

import React, { useCallback, useState, useEffect } from 'react';
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
import AI from '../AI/AI';
import Popup from '../Popup/Popup';
import Leadership from '../Leadership/Leadership';

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
  const { loading, error, data, refetch } = useQuery<MyQueryData>(MY_QUERY);
  const { writeContract, isSuccess, data: writeContractData, status } = useWriteContract(); // create market
  const [amount, setAmount] = useState('');
  const [aiQuestion, setAiQuestion] = useState<string | null>(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isPopupVisible1, setIsPopupVisible1] = useState(false);

  const handleButtonClick = useCallback(
    async (marketId: string, outcome: string, amount: string, index: number) => {
      try {
        await writeContract({
          abi,
          address: myconfig.CONTRACT_ADDRESS_opSEPOLIA as Address,
          functionName: 'sendCrossChainDeposit',
          args: [
            10003,
            "0x4EEc84B0f4Fb1c035013a673095b1E7e73ea63cc", 
            "0x4EEc84B0f4Fb1c035013a673095b1E7e73ea63cc", 
            parseEther(amount),
            "0x0ee7F43c91Ca54DEEFb58B261A454B9E8b4FEe8B",
            marketId, 
            index],

            value: BigInt("18000000000000000")
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



  // const handleAiClick = (question: string) => {
  //   setAiQuestion(question); // Set the question to pass to the AI component
  // };
  const handleAiClick = (question: string) => {
    setAiQuestion(question);
    setIsPopupVisible(true);
    console.log("Popup should be visible:", isPopupVisible); // Debug
  };
  
  const closePopupAi = () => {
    setIsPopupVisible(false);
    setAiQuestion(null);
    console.log("Popup should be hidden:", isPopupVisible); // Debug
  };



  
  const closeRankPopup = () => {
    setIsPopupVisible1(false);
    setSelectedMarket(null);
    console.log("Popup should be hidden:", isPopupVisible); // Debug
  };

  const handleQuestionClick = (market: MarketCreated) => {
    setSelectedMarket(market);
    setIsPopupVisible1(true);
  };

 
  if (isSuccess) {
    refetch();  // Refetch the data after a successful transaction
  }

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
                      <div className='Market Image' style={{ width: 50, height: 50, backgroundColor: 'gray' }} />
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
                <div className='route'>
                  <div>
                    <WithdrawWinning MarketId={market.marketId} />
                  </div>
                  <div>
                    <button onClick={() => handleAiClick(market.question)}>Ask AI</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Render the AI component when a question is selected */}
      <Popup isVisible={isPopupVisible} onClose={closePopupAi}>
        {aiQuestion && <AI question={aiQuestion} />}
      </Popup>
      {/* {selectedMarket && <CommentPop market={selectedMarket} onClose={closePopup} />} */}
      
      
        <Popup isVisible={isPopupVisible1} onClose={closeRankPopup}>
        { 
        selectedMarket && <Leadership marketId={selectedMarket.marketId}  />
        }
        </Popup>
      
      
      <TransactionStatus status={status} writeContractData={writeContractData} />
    </section>
  );
}

export default GetmarketList;
