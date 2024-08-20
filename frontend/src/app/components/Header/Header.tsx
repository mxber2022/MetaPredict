"use client";
import React, { useState } from "react";
import "./Header.css";

function Header() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            title: "VERIDICT",
            content: (
                <>
                    <h2>Decentralized Pari-Mutuel Betting Platform</h2>
                    <p><strong>Name:</strong> MX</p>
                    <p><strong>Date:</strong> 20.Aug 2024</p>
                    <p><strong>Goal: </strong>Revolutionizing the Prediction Market</p>
                </>
            ),
        },
        {
            title: "What is VERIDICT",
            content: (
                <>
                    <h2>Introduction</h2>
                    <p><strong></strong> Prediction market based on Pari-Mutuel algorithm </p>
                </>
            ),
        },
        {
            title: "How Pari-Mutuel Algorithm Works",
            content: (
                <>
                    <h2>How Pari-Mutuel Algorithm Works</h2>
                    <ul>
                        <li><strong>Pooled System:</strong> All bets of a particular type are combined into a single pool.</li>
                        <li><strong>Winning Amount Distribution:</strong> Payouts are distributed proportionally based on the amount bet on each outcome.</li>
                    </ul>
                    <ol>
                        <li><strong>Collect Bets:</strong> Aggregate all bets placed on the specific event into a single pool.</li>
                        <li><strong>Apply Deductions:</strong> Subtract the house takeout, taxes, and any other fees from the total pool.
                        </li>
                        <li><strong>Determine Winning Bets:</strong> Identify which bets are winners based on the event outcome.</li>
                        <li><strong>Calculate Payouts:</strong> Distribute the net pool among the winning bets proportionally.
                            <ul>
                                <li>
                                    <pre>
                                        {`Payout per Winning Bet = (Net Pool / Total Amount Bet on Winning Outcome) * Amount Bet on Individual Winning Bet`}
                                    </pre>
                                </li>
                            </ul>
                        </li>
                        <li><strong>Distribute Winnings:</strong> Payout amounts are credited to the accounts of those holding winning bets.</li>
                    </ol>
                </> 
            ),
        },
        // {
        //     title: "Platform Features",
        //     content: (
        //         <>
        //             <h2>Platform Features</h2>
        //             <ul>
        //                 <li><strong>Decentralization:</strong> Powered by smart contracts on Ethereum, eliminating the need for intermediaries.</li>
        //                 <li><strong>Transparency:</strong> All bets and market resolutions are recorded on the blockchain, ensuring fairness and visibility.</li>
        //                 <li><strong>Automatic Payouts:</strong> Winnings are automatically distributed once a market is resolved.</li>
        //                 <li><strong>Low Fees:</strong> Reduced operational costs due to the lack of intermediaries.</li>
        //                 <li><strong>User-friendly Interface:</strong> Easy to create markets, place bets, and withdraw winnings.</li>
        //             </ul>
        //         </>
        //     ),
        // },
        {
            title: "Technical Architecture",
            content: (
                <>
                    <h2>Technical Architecture</h2>
                    <ul>
                        <li><strong>Blockchain:</strong> Hedera</li>
                        <li><strong>Subgraph:</strong> Data provider</li>
                        {/* <li><strong>Blockscout:</strong> SmartContract Verification</li> */}
                    </ul>
                </>
            ),
        },
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
                        <li><strong>Phase 1.1:</strong> Going Crosschain (LayerZero)</li>
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
        // {
        //     title: "Team",
        //     content: (
        //         <>
        //             <h2>Team</h2>
        //             <p><strong></strong>MX</p>
        //         </>
        //     ),
        // },
        // {
        //     title: "Conclusion & Call to Action",
        //     content: (
        //         <>
        //             <h2>Conclusion & Call to Action</h2>
        //             <p><strong>Summary:</strong> Recap the platform’s unique selling points, including decentralization, transparency, and potential market impact.</p>
        //             <p><strong>Call to Action:</strong> Invite investors, partners, or collaborators to join the project. Provide contact information for follow-up discussions.</p>
        //             <p><strong>Q&A:</strong> Open the floor for any questions from the audience.</p>
        //         </>
        //     ),
        // },
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
