import { http, createConfig } from '@wagmi/core'
import { mainnet, sepolia, modeTestnet } from '@wagmi/core/chains'

export const config = createConfig({
  chains: [mainnet, sepolia, modeTestnet],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [modeTestnet.id]: http(""),
  },
})