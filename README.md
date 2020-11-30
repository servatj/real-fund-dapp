# RealFund Interface

[![Netlify Status](https://api.netlify.com/api/v1/badges/1bfc98a0-bc1f-403e-8c61-e71334b3585a/deploy-status)](https://app.netlify.com/sites/affectionate-nightingale-a6ae3e/deploys)
[![Styled With Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io/)

An open source interface for RealFund  for the Crypto plaza Hackathon -- a protocol for decentralized exchange of RFD tokens.

- Website: [realfund.tech](https://realfund.tech/)
- Interface: [demo](https://affectionate-nightingale-a6ae3e.netlify.app/)

## Accessing the RFD Pool Balancer

To access the RFD Interface
[latest release](https://github.com/Uniswap/uniswap-interface/releases/latest), 
or visit [app.uniswap.org](https://app.uniswap.org).

## Development

### Install Dependencies

```bash
yarn
```

### Run

```bash
yarn start
```

### Build

```bash
yarn build
```
### Configuring the environment (optional)

Replace Harcoded contract if you deploy your own ones 

```
{
  realFundToken: "0x65516Eef4dCfd360F8CAE4B10A51CDe25b4aD6E9", 
  daiContract: "0xc4D4A81631978e5096bC60C18Af385a7284EF24C",
  poolContract: "0x7E67499Bafdc6EdA887461937A1AB16b532f856B"
}
```

## Contributions

**Please open all pull requests against the `master` branch.** 
CI checks will run against all PRs.
