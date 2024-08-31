# MetaPredict

MetaPredict is a crosschain prediction market platform built using the Wormhole protocol and employing the parimutuel algorithm for accurate prediction outcomes. Users can participate in predicting various events across different blockchain networks, ensuring transparency and reliability through decentralized technology.

## Contract Address

Optimism Sepolia - 0xaaa906c8c2720c50b69a5ba54b44253ea1001c98 <br></br>
Arbitrum Sepolia - 0x4EEc84B0f4Fb1c035013a673095b1E7e73ea63cc

## Features

- **Crosschain Prediction:** Predict events across different blockchain networks.
- **Decentralized:** Built on the Wormhole protocol for secure and transparent operations.
- **Parimutuel Algorithm:** Ensures fair and accurate prediction outcomes.
- **User-Friendly Interface:** Intuitive design for seamless user interaction using Next.js.
- **Incentive Mechanisms:** Reward mechanisms for predictors and liquidity providers.

## Architecture

The MetaPredict architecture consists of several key components interacting across different chains:

<pre style={{ color: "white" }}>
{`
+----------------------------+       +----------------------------+       +----------------------------+
|                            |       |   Cross-Chain Messaging    |       |     Arbitrum Sepolia       |
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

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

- Node.js (v16 or later)
- Yarn 

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/mxber2022/MetaPredict
   ```
2. Navigate into the project directory
   ```sh
   cd MetaPredict
   ```
3. Install dependencies
   ```sh
   yarn 
   ```

### Development

1. Start the development server
   ```sh
   yarn dev
   ```
   The application will be available at [http://localhost:3000](http://localhost:3000).

### Build and Deployment

1. Build the application
   ```sh
   yarn build
   ```
2. Start the production server
   ```sh
   yarn start
   ```

## Live Demo

Explore the live version of MetaPredict at: [https://meta-predict.vercel.app](https://meta-predict.vercel.app)

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

For inquiries, please reach out to [mxber2022@gmail.com](mailto:mxber2022@gmail.com).

Project Link: [https://github.com/mxber2022/MetaPredict](https://github.com/mxber2022/MetaPredictt)
