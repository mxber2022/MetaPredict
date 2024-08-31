import React, { useState, useEffect, useRef } from "react";
import "./TransactionStatus.css";
import ProccingGif from './Assets/proccing.webp';
import CheckGif from './Assets/check.gif';
import Image from "next/image";
import { waitForTransactionReceipt } from '@wagmi/core';
import { config } from './config';

function TransactionStatus({ status, writeContractData }: { status: any, writeContractData: any }) {
  const [isPopupVisible, setIsPopupVisible] = useState(true);
  const [pendingConfirmation, setConfirmation] = useState(true);
  const hasMounted = useRef(false);  // Use useRef to track if the component has mounted

  const closePopUp = (e: any) => {
    e.preventDefault();
    setIsPopupVisible(false);
    setConfirmation(true);
  };

  console.log("writeContractData",writeContractData)
  // Reset the visibility of the popup when status changes, but only after the first render
  useEffect(() => {
    if (hasMounted.current) {
      setIsPopupVisible(true);
      setConfirmation(true);
    } else {
      hasMounted.current = true; // Set the ref to true after the first render
    }
  }, [status]); 

  const fetchTransactionReceipt = async () => {
    try {
      // const transactionReceipt = await waitForTransactionReceipt(config, {
      //   confirmations: 2,
      //   hash: writeContractData,
      // });
      await new Promise(resolve => setTimeout(resolve, 10000)); //optimism fix
      console.log('Transaction receipt:', );
      setConfirmation(false);
    } catch (error) {
      console.error('Error fetching transaction receipt:', error);
    }
  };

  useEffect(() => {
    if (writeContractData) {
      // Start fetching the receipt if pendingConfirmation is true
      fetchTransactionReceipt();
    }
  }, [writeContractData]);

  return (
    <>
      {isPopupVisible && (
        <div className={`proccing ${status === 'pending' ? 'pending' : status === 'success' ? 'done' : ''}`}>
          {status === 'pending' && (
            <div className='pending_popup'>
              <Image src={ProccingGif} alt="Processing GIF" />
              <p>Don't close the window</p>
            </div>
          )}

          {status === 'success' && (
            <div className='success_popup'>
              
             
    
              {
              pendingConfirmation && 
              <p>Transaction pending</p>
              }

              {
              !pendingConfirmation && 
              <>
               <Image src={CheckGif} alt="CheckGif" />
                <p>Transaction Confirmed</p>
                <p>
                {/* Success <br /><br /> */}
                <a href="#" onClick={closePopUp}>Close and return to the website</a>
              </p>
              </>
              }
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default TransactionStatus;
