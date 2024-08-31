"use client"
import { useState } from 'react';
import { useWriteContract } from 'wagmi'
import { abi } from '../../../abi'
import myconfig from '../../../myconfig.json'
import { Address } from 'viem';
import "./CreateMarket.css";
import TransactionStatus from '../TransactionStatus/TransactionStatus';
import { formatEther } from 'viem'
import { useClient } from 'wagmi';

function Createmarket() {
    
    const [question, setQuestion] = useState('');
    const [uri, setUri] = useState('');
    const [outcomes, setOutcomes] = useState(['']);
    const [status, setStatus] = useState('');
        
    // Handler to add a new outcome input field
    const addOutcome = () => {
        setOutcomes([...outcomes, '']);
    };

    // Handler to remove an outcome input field
    const removeOutcome = (index: any) => {
        const newOutcomes = outcomes.filter((_, i) => i !== index);
        setOutcomes(newOutcomes);
    };
        
    // Handler to update outcome value
    //@ts-ignore
    const handleOutcomeChange = (index, event) => {
        const newOutcomes = outcomes.slice();
        newOutcomes[index] = event.target.value;
        setOutcomes(newOutcomes);
    };
        
    // Handler to create market

    const { writeContract, isSuccess, data: writeContractData, status: writeContractStatus, error } = useWriteContract()
    const client = useClient();
    //@ts-ignore
    const createMarket = async (event) => {
        event.preventDefault();
        let sourceContractAdress;

        if(client?.chain.id == 11155420){
          sourceContractAdress = myconfig.CONTRACT_ADDRESS_opSEPOLIA;
        }

        writeContract({ 
            abi,
            address: sourceContractAdress as Address,
            functionName: 'sendCrossChainGreeting',  // createMarket
            args: [
                10003, // Target Chain
                myconfig.CONTRACT_ADDRESS_BASE as Address, // Target Address
                question,
                outcomes,
                uri
            ],
            value: BigInt("18000000000000000")
         })
    }; 
    console.log(error);
    
    return (
        <section className='createMarket'>
          <div className='createMarket__container'>
            <h2>Create Market</h2>
              <form onSubmit={createMarket}>
                  <div>
                    <label>Market Question:</label>
                    <input
                      type="text"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label>Market ImageUri:</label>
                    <input
                      type="text"
                      value={uri}
                      onChange={(e) => setUri(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label>Outcomes:</label>
                    {outcomes.map((outcome, index) => (
                      <div key={index} className="outcome-input">
                        <input
                          type="text"
                          value={outcome}
                          onChange={(e) => handleOutcomeChange(index, e)}
                          required
                        />
                        {outcomes.length > 1 && (
                          <div>
                          <button className="btremove" type="button" onClick={() => removeOutcome(index)}> Remove </button>
                          </div>
                        )}
                      </div>
                    ))}
                    <button className='btnright' type="button" onClick={addOutcome}> Add Outcome </button>
                  </div>
                  <button type="submit">Create Market</button>
              </form>
              {status && <p>{status}</p>}
          </div>

          <TransactionStatus status={writeContractStatus} writeContractData={writeContractData} />

        </section>
          );
}

export default Createmarket;
