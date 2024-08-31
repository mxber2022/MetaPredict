// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "wormhole-solidity-sdk/interfaces/IWormholeRelayer.sol";
import "wormhole-solidity-sdk/interfaces/IWormholeReceiver.sol";
// import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "wormhole-solidity-sdk/interfaces/ITokenBridge.sol";
import "wormhole-solidity-sdk/interfaces/IWormhole.sol";
import "wormhole-solidity-sdk/interfaces/IERC20.sol";

contract HelloWormhole is IWormholeReceiver {
    event GreetingReceived(string greeting, uint16 senderChain, address sender);

    //uint256 constant GAS_LIMIT = 10_00000;
    uint256 constant GAS_LIMIT = 400_000;
    
    IWormholeRelayer public immutable wormholeRelayer;
    ITokenBridge public immutable tokenBridge;
    IWormhole public immutable wormhole;

    string public latestGreeting;

    constructor(address _wormholeRelayer, address _tokenBridge, address _wormhole) {
        wormholeRelayer = IWormholeRelayer(_wormholeRelayer);
        tokenBridge = ITokenBridge(_tokenBridge);
        wormhole = IWormhole(_wormhole);
        owner = msg.sender;
    }

    function quoteCrossChainGreeting(
        uint16 targetChain
    ) public view returns (uint256 cost) {
        (cost, ) = wormholeRelayer.quoteEVMDeliveryPrice(
            targetChain,
            0,
            GAS_LIMIT
        );
    }

    function sendCrossChainGreeting(
        uint16 targetChain,
        address targetAddress,
        string memory question, 
        string[] memory outcomes, 
        string memory imageUri
    ) public payable {
        uint256 cost = quoteCrossChainGreeting(targetChain);
        require(msg.value == cost);
        wormholeRelayer.sendPayloadToEvm{value: cost}(
            targetChain,
            targetAddress,
            abi.encode(question, outcomes, imageUri, msg.sender), // payload
            0, // no receiver value needed since we're just passing a message
            GAS_LIMIT
        );
    }

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

    // fix only owner

    function createMarket(string memory question, string[] memory outcomes, string memory imageUri) public {
        require(outcomes.length > 1, "At least two outcomes required");
        marketCount++;
        Market storage market = markets[marketCount];
        market.question = question;
        market.outcomes = outcomes;
        market.imageUri = imageUri; // Set the image URI
        market.resolved = false;

        emit MarketCreated(marketCount, question, outcomes, imageUri);
    }

    function placeBet(uint256 marketId, uint256 outcomeIndex, uint256 amountUserSent, address user) public {
        Market storage market = markets[marketId];
        require(!market.resolved, "Market already resolved");
        //require(msg.value > 0, "Must send Ether to place bet");
        require(outcomeIndex < market.outcomes.length, "Invalid outcome index");

        market.outcomeBets[outcomeIndex] += amountUserSent;
        market.userBets[user][outcomeIndex] += amountUserSent;
        market.totalPool += amountUserSent;

        emit BetPlaced(marketId, msg.sender, outcomeIndex, amountUserSent);
    }

    function resolveMarket(uint256 marketId, uint256 winningOutcomeIndex) public onlyOwner {
        Market storage market = markets[marketId];
        require(!market.resolved, "Market already resolved");
        require(winningOutcomeIndex < market.outcomes.length, "Invalid outcome index");

        market.resolved = true;
        market.winningOutcomeIndex = winningOutcomeIndex;

        emit MarketResolved(marketId, winningOutcomeIndex);
    }

    //nonReentrant
    function withdrawWinnings(uint256 marketId) public {
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

    /*
        Token Transfer 
    */

        function quoteCrossChainDeposit(uint16 targetChain) public view returns (uint256 cost) {
            uint256 deliveryCost;
            (deliveryCost,) = wormholeRelayer.quoteEVMDeliveryPrice(targetChain, 0, GAS_LIMIT);
            cost = deliveryCost + wormhole.messageFee();
        }

        function sendCrossChainDeposit(
            uint16 targetChain,
            address targetHelloToken,
            address recipient,
            uint256 amount,
            address token,
            uint256 marketId, uint256 outcomeIndex
        ) public payable {
            // emit token transfers
            //uint256 marketId, uint256 outcomeIndex, uint256 amountUserSent, address user
            IERC20(token).transferFrom(msg.sender, address(this), amount);
            IERC20(token).approve(address(tokenBridge), amount);
            uint64 sequence = tokenBridge.transferTokens{value: wormhole.messageFee()}(
                token, amount, targetChain, toWormholeFormat(targetHelloToken), 0, 0
            );

            // specify the token transfer vaa should be delivered along with the payload
            VaaKey[] memory additionalVaas = new VaaKey[](1);
            additionalVaas[0] = VaaKey({
                emitterAddress: toWormholeFormat(address(tokenBridge)),
                sequence: sequence,
                chainId: wormhole.chainId()
            });

            uint256 cost = quoteCrossChainDeposit(targetChain);
            require(msg.value == cost, "Incorrect payment to cover delivery cost");

            // encode payload
            bytes memory payload = abi.encode("placeBet", recipient, marketId, outcomeIndex, amount, msg.sender);

            wormholeRelayer.sendVaasToEvm{value: cost - wormhole.messageFee()}(
                targetChain,
                targetHelloToken,
                payload,
                0, // no receiver value needed since we're just passing a message + wrapped token
                GAS_LIMIT,
                additionalVaas
            );
        }

        function receiveWormholeMessages(
            bytes memory payload,
            bytes[] memory additionalVaas,
            bytes32, // sourceAddress
            uint16 sourceChain,
            bytes32 // deliveryHash
        ) public payable override {
            require(msg.sender == address(wormholeRelayer), "Only wormhole allowed");

            (string memory actionType) = abi.decode(payload, (string));

            if(keccak256(abi.encodePacked(actionType)) == keccak256(abi.encodePacked("placeBet"))){
                //"Expected 2 additional VAA keys for token transfers"
                //address recipient = abi.decode(payload, (address));
                //require(additionalVaas.length == 2, "Expected 2 additional VAA keys for token transfers");
                ( , address recipient, uint256 marketId, uint256 outcomeIndex, uint256 amount, address sender) = abi.decode(payload, (string, address, uint256, uint256, uint256, address));
    
                IWormhole.VM memory parsedVM = wormhole.parseVM(additionalVaas[0]);
                ITokenBridge.Transfer memory transfer = tokenBridge.parseTransfer(parsedVM.payload);
                tokenBridge.completeTransfer(additionalVaas[0]);

                address wrappedTokenAddress = transfer.tokenChain == wormhole.chainId() ? fromWormholeFormat(transfer.tokenAddress) : tokenBridge.wrappedAsset(transfer.tokenChain, transfer.tokenAddress);
                
                uint256 decimals = getDecimals(wrappedTokenAddress);
                uint256 powerOfTen = 0;
                if(decimals > 8) powerOfTen = decimals - 8;
                IERC20(wrappedTokenAddress).transfer(recipient, transfer.amount * 10 ** powerOfTen); 
                //uint256 marketId, uint256 outcomeIndex, uint256 amountUserSent, address user
                placeBet(marketId, outcomeIndex, amount, sender);
            }
            else {
                require(msg.sender == address(wormholeRelayer), "Only relayer allowed");
                (string memory question, string[] memory outcomes, string memory imageUri, address sender) = abi.decode(payload, (string, string[], string, address));
                latestGreeting = question;
                createMarket(question, outcomes, imageUri);
                emit GreetingReceived(latestGreeting, sourceChain, sender);
            }

            
        }
        
        function toWormholeFormat(address addr) public pure returns (bytes32) {
            return bytes32(uint256(uint160(addr)));
        }

        function fromWormholeFormat(bytes32 whFormatAddress) public pure returns (address) {
            if (uint256(whFormatAddress) >> 160 != 0) {
                revert NotAnEvmAddress(whFormatAddress);
            }
            return address(uint160(uint256(whFormatAddress)));
        }

        function getDecimals(address tokenAddress) public view returns (uint8 decimals) {
            // query decimals
            (,bytes memory queriedDecimals) = address(tokenAddress).staticcall(abi.encodeWithSignature("decimals()"));
            decimals = abi.decode(queriedDecimals, (uint8));
        }

}


