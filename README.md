#   PPP 🐣
An app that allows users to set up and manage personal pension funds using any ERC-20 token.

Project built in the ETHGlobal San Francisco 2024

## 👤 Author
- Federico Loterstein 

## 🌈 About

Create your own pension fund linked to any ERC-20 token. This app allows you to deposit, withdraw, invest, and pass on your funds to another person if no proof of life is provided within three years.

Features:

ERC-20 Compatibility: The contract supports any ERC-20 token (USDC is used in this demo). 
Flexible Withdrawals: The account holder can withdraw funds anytime. 
Proof of Life: Regular interactions with the contract ensure continued access and can be manually updated.

The project was built using Scaffold-ETH 2 as the foundation for both the frontend and smart contracts. A security layer was added with OpenZeppelin, implementing ReentrancyGuard, Ownable, and Pausable functions. Additionally, a frame was created to interact directly with the smart contract in Farcaster, along with an XMTP bot to enable chat-based communication.

The smart contract is deployed across multiple blockchains, offering users broad interoperability.
## Contracts

| Red                         | Retirement.sol                               | USDCMock.sol                                 |
| --------------------------- | -------------------------------------------- | -------------------------------------------- |
| Sepolia                     | `0xB85F6d3A45361aE08AeCdb3Cfb9e558d9E7B94B7` | `0x8E33Bae126e6cCFB0AaEAc6eA7d8E46e9C957D28` |
| Base Sepolia                | `0x8E33Bae126e6cCFB0AaEAc6eA7d8E46e9C957D28` | `0xA4832FB68BF9ca311e317b24F7bBc524c80E2dDE` |
| FlowEVM Testnet             | `0xab48D3707732DF21071F0A1F882e7d968174A840` | `0x4bB24185e5e0e80A92f5730BA78990aA60854e77` |
| Rootstock Testnet           | `0xab48D3707732DF21071F0A1F882e7d968174A840` | `0x4bB24185e5e0e80A92f5730BA78990aA60854e77` |
| AirDao Testnet              | `0xab48D3707732DF21071F0A1F882e7d968174A840` | `0x4bB24185e5e0e80A92f5730BA78990aA60854e77` |
| Zircuit Testnet             | `0xab48D3707732DF21071F0A1F882e7d968174A840` | `0x4bB24185e5e0e80A92f5730BA78990aA60854e77` |
| PolygonZkEvmCardona Testnet | `0xab48D3707732DF21071F0A1F882e7d968174A840` | `0x4bB24185e5e0e80A92f5730BA78990aA60854e77` |
| MorphHolesky Testnet         | `0x8E33Bae126e6cCFB0AaEAc6eA7d8E46e9C957D28` | `0xA4832FB68BF9ca311e317b24F7bBc524c80E2dDE` |


## Frames 🌅

https://ethglobal-sf-frame.vercel.app/api

## XMTP bot

0x7C23160141b8f37aF064568a8E749722E5EE6718

