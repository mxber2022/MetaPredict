"use client";
import React, { useState } from "react";
import "./Header.css";

function Header() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            title: "MetaPredict",
            content: (
                <>
                    <h2>Decentralized Pari-Mutuel Betting Platform</h2>
                    <p><strong>Name:</strong> MX</p>
                    <p><strong>Date:</strong> 31.Aug 2024</p>
                    <p><strong>Goal: </strong>CrossChain the Prediction Market</p>
                </>
            ),
        },
        {
            title: "What is MetaPredict",
            content: (
                <>
                    <h2>Introduction</h2>
                    <p><strong></strong> Crosschain Prediction Market </p>
                    <p><strong></strong> Powered by Wormhole </p>
                </>
            ),
        },

        {
            title: "Technical Architecture",
            content: (
                <>
                    <pre style={{ color: "white" }}>
        {`
        +----------------------------+       +----------------------------+       +----------------------------+
        |                            |       |   Cross-Chain Messaging    |       |     Ethereum Sepolia       |
        | - Prediction Market Smart  |<----->| - Listens to Events        |<----->| - Mirror Market Creation   |
        |   Contract (createMarket)  |       | - Relays Market Data       |       |   destination chain        |
        |                            |       | - Uses Wormhole            |       |                            |
        +----------------------------+       +----------------------------+       +----------------------------+
                         ^                                                                
                         |                                                                
                                                                                            
        +----------------------------+                                        
        |        User (Frontend)     |                                         
        |   Interacts with Market    |                                         
        |   on source chainX         |                                         
        |                            |                                         
        +----------------------------+                                         
        `}
                    </pre>
                </>
            ),
        }
        
        
,        
        {
            title: "Market Potential",
            content: (
                <>
                    <h2>Market Potential</h2>
                    <ul>
                        <li><strong>Industry Size:</strong> Predicted $500 billion by 2028</li>
                        <li><strong>Target Audience:</strong> Crypto, Sports bettors, eSports enthusiasts, and casual gamblers who seek transparency and fairness.</li>
                        <li><strong>Competitive Advantage:</strong> Trustless environment, lower operational costs, global accessibility.</li>
                    </ul>
                </>
            ),
        },
        {
            title: "Revenue Model",
            content: (
                <>
                    <h2>Revenue Model</h2>
                    <ul>
                        <li><strong>Fee Structure:</strong> Revenue generation through small fees on each transaction (e.g., a percentage of the total pool).</li>
                        <li><strong>Additional Revenue Streams:</strong> Partnerships, sponsored markets, or premium features.</li>
                        <li><strong>Growth Potential:</strong> User acquisition and retention strategies to drive platform growth.</li>
                    </ul>
                </>
            ),
        },
        {
            title: "Upcoming",
            content: (
                <>
                    <h2>Upcoming Fetures</h2>
                    <ul>
                        <li><strong>Phase 1:</strong> Using oracle to resolve market</li>
                        <li><strong>Phase 2:</strong> Feature Expansion - Introduce advanced features like analytics, multi crypto currency support, and mobile apps.</li>
                        <li><strong>Phase 3:</strong> Community & Partnerships - Build a strong user base and form strategic partnerships.</li>
                        <li><strong>Phase 4:</strong> Global Scaling - Expand the platform’s reach to new markets.</li>
                    </ul>
                </>
            ),
        },

        {
            title: "Demo",
            content: (
                <>
                    <h2>Demo</h2>
                </>
            ),
        },
    ];

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    return (
        <header className="header">
            <div className="header__container">
                <div className="slider">
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className={`slide ${index === currentSlide ? "active" : ""}`}
                        >
                            <h3>{slide.title}</h3>
                            <div>{slide.content}</div>
                        </div>
                    ))}
                </div>
                <button className="prev" onClick={prevSlide}>
                    &#10094;
                </button>
                <button className="next" onClick={nextSlide}>
                    &#10095;
                </button>
            </div>
        </header>
    );
}

export default Header;
