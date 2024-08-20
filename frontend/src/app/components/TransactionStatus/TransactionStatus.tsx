"use client"

import "./TransactionStatus.css"
import ProccingGif from './Assets/proccing.webp';
import CheckGif from './Assets/check.gif';
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { waitForTransactionReceipt } from '@wagmi/core'
import { config } from './config';
import { mainnet, sepolia, modeTestnet } from '@wagmi/core/chains'

function TransactionStatus(status: any, writeContractData: any) {

  const [isPopupVisible, setIsPopupVisible] = useState(true);

  const closePopUp = (e: any) => {
    e.preventDefault(); 
    setIsPopupVisible(false);
  };

  // Reset the visibility of the popup whenever the status changes
  useEffect(() => {
    setIsPopupVisible(true);
  }, [status]);

  // const transactionReceipt = waitForTransactionReceipt( config,{ 
  //   confirmations: 10, 
  //   //@ts-ignore
  //   hash: writeContractData?.writeContractData
  // })


  const fetchTransactionReceipt = async () => {
    try {
        console.log("help");
        const receipt = await waitForTransactionReceipt(config, {
          confirmations: 10,
          chainId: modeTestnet.id,
          hash: status.writeContractData,
        });
      console.log('Transaction receipt:', receipt);
    } 
    catch (error) {
      console.error('Error fetching transaction receipt:', error);
    }
  };

  if(status.writeContractData != undefined) {
    console.log("helll", status.writeContractData);
    fetchTransactionReceipt();
  }

  return(
    <>
    {
      isPopupVisible && (
        <div className={`proccing ${status.status === 'pending' ? 'pending' : status.status === 'success' ? 'done' : ''}`}>
            {status.status === 'pending' && (
              <div className='pending_popup'>
                <Image src={ProccingGif} alt="Processing GIF" />
                <p>
                  Don't close the window
                </p>
              </div>
            )}

              {status.status === 'success' && (
                <div className='success_popup'>
                  <Image src={CheckGif} alt="CheckGif" />
                  <p>
                    Success <br /><br />
                    <a href="#" onClick={closePopUp}>Close and return to the website</a>
                  </p>
                  {/* <div className="thash">
                    <p>{status.writeContractData}</p>
                  </div> */}
                </div>
              )}
        </div>
    )}
    </>
  )
}
export default TransactionStatus;