"use client"

import "./CommentPop.css"
import Image from "next/image";

interface MarketCreated {
    marketId: string;
    outcomes: string;
    question: string;
    imageUri: string;
}
  
interface PopupProps {
    market: MarketCreated;
    onClose: () => void;
}

function CommentPop ({ market, onClose}: any) {
    return(
        <>
        <div className="popup">
            <div className="popup-content">
                <span className="popup-close" onClick={onClose}>&times;</span>
                <h2>{market.question}</h2>
                <Image src={market.imageUri.concat('?raw=true')} alt="img" width={100} height={100} />
                <p>Outcomes: {market.outcomes}</p>
            </div> 
        </div>
        </>
    )
}

export default CommentPop;