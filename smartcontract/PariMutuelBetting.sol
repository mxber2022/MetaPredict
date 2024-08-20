// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract PariMutuelBetting is ReentrancyGuard {
    address public owner;

    struct Market {
        string question;
        string[] outcomes;
        string imageUri; // New field for image URI
        mapping(uint256 => uint256) outcomeBets;
        mapping(address => mapping(uint256 => uint256)) userBets;
        uint256 totalPool;
        bool resolved;
        uint256 winningOutcomeIndex;
    }

    mapping(uint256 => Market) public markets;
    uint256 public marketCount;

    event MarketCreated(uint256 marketId, string question, string[] outcomes, string imageUri);
    event BetPlaced(uint256 marketId, address indexed user, uint256 outcomeIndex, uint256 amount);
    event MarketResolved(uint256 marketId, uint256 winningOutcomeIndex);
    event WinningsWithdrawn(uint256 marketId, address indexed user, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createMarket(string memory question, string[] memory outcomes, string memory imageUri) public onlyOwner {
        require(outcomes.length > 1, "At least two outcomes required");
        marketCount++;
        Market storage market = markets[marketCount];
        market.question = question;
        market.outcomes = outcomes;
        market.imageUri = imageUri; // Set the image URI
        market.resolved = false;

        emit MarketCreated(marketCount, question, outcomes, imageUri);
    }

    function placeBet(uint256 marketId, uint256 outcomeIndex) public payable {
        Market storage market = markets[marketId];
        require(!market.resolved, "Market already resolved");
        require(msg.value > 0, "Must send Ether to place bet");
        require(outcomeIndex < market.outcomes.length, "Invalid outcome index");

        market.outcomeBets[outcomeIndex] += msg.value;
        market.userBets[msg.sender][outcomeIndex] += msg.value;
        market.totalPool += msg.value;

        emit BetPlaced(marketId, msg.sender, outcomeIndex, msg.value);
    }

    function resolveMarket(uint256 marketId, uint256 winningOutcomeIndex) public onlyOwner {
        Market storage market = markets[marketId];
        require(!market.resolved, "Market already resolved");
        require(winningOutcomeIndex < market.outcomes.length, "Invalid outcome index");

        market.resolved = true;
        market.winningOutcomeIndex = winningOutcomeIndex;

        emit MarketResolved(marketId, winningOutcomeIndex);
    }

    function withdrawWinnings(uint256 marketId) public nonReentrant {
        uint256 winnings = getUserWinningAmount(marketId);
        require(winnings > 0, "No winnings to withdraw");

        Market storage market = markets[marketId];
        market.userBets[msg.sender][market.winningOutcomeIndex] = 0; // Prevent re-entrancy

        payable(msg.sender).transfer(winnings);

        emit WinningsWithdrawn(marketId, msg.sender, winnings);
    }

    function getUserWinningAmount(uint256 marketId) public view returns (uint256) {
        Market storage market = markets[marketId];
        require(market.resolved, "Market not yet resolved");

        uint256 userBet = market.userBets[msg.sender][market.winningOutcomeIndex];
        if (userBet == 0) {
            return 0;
        }

        uint256 totalBetsOnWinner = market.outcomeBets[market.winningOutcomeIndex];
        if (totalBetsOnWinner == 0) {
            return 0; // Handle case where no bets were placed on the winning outcome
        }

        uint256 winnings = (userBet * market.totalPool) / totalBetsOnWinner;
        return winnings;
    }

    function getMarketDetails(uint256 marketId) public view returns (string memory, string[] memory, string memory, bool, uint256, uint256) {
        Market storage market = markets[marketId];
        return (market.question, market.outcomes, market.imageUri, market.resolved, market.winningOutcomeIndex, market.totalPool);
    }

    function getUserBet(uint256 marketId, uint256 outcomeIndex) public view returns (uint256) {
        Market storage market = markets[marketId];
        return market.userBets[msg.sender][outcomeIndex];
    }
}
