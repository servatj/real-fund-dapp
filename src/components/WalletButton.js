import React, { useCallback, useState } from 'react';
import Button from '@material-ui/core/Button';
import { web3Modal, logoutOfWeb3Modal, shortenAddress } from '../utils/web3Modal';
import { Web3Provider, getDefaultProvider } from "@ethersproject/providers";
import Web3 from 'web3';
import daiToken from '../abis/DaiToken.json';
import realFundToken from '../abis/RealFundTokenERC20.json';
import balancerPool from '../abis/IBPool.json';

const WalletButton = ({ provider, setProvider, setUserAddress, setBalance, setWeb3, setSpotPrice, setDAI, setRFD }) => {

  const config = {
    realFundToken: "0x47a91E95716B2C0d9670a3FB98b0A24B84D96f07",
    daiContract: "0xA5F974438Ff347216D216Da660D647e777142969",
    poolContract: "0xe6d35F9fD28d4589a3757fe0a45C93616C74015D",
    userWhiteList: "0x84ACb643A378282145b84FCb371a9e502bffe193"
  }

  const loadWeb3Modal = useCallback(async () => {""
    const newProvider = await web3Modal.connect();    
    let web3 = new Web3(window.ethereum);
    let currentAddress = await web3.eth.getAccounts();
    let balance = await web3.eth.getBalance(currentAddress[0]);

    const daiContract = new web3.eth.Contract(daiToken.abi, config.daiContract);
    setDAI(await daiContract.methods.balanceOf(currentAddress[0]).call());
    //tokenContext({ dai: 10 });
    
    const rfdContract = new web3.eth.Contract(realFundToken.abi, config.realFundToken);
    setRFD(await rfdContract.methods.balanceOf(currentAddress[0]).call());


    const poolContract = new web3.eth.Contract(balancerPool.abi, config.poolContract);
    console.log(poolContract, config.realFundToken, config.daiContract, config.poolContract)
    const spotPrice = await poolContract.methods.getSpotPrice(config.daiContract, config.realFundToken).call();
    console.log('spot price', spotPrice)
    
    setProvider(new Web3Provider(newProvider));
    setUserAddress(currentAddress[0]);
    setBalance(balance);
    setWeb3(web3);
    setSpotPrice(spotPrice * 1);

    newProvider.on("accountsChanged", accounts => {
      console.log("accountsChanged", accounts);
      setUserAddress(accounts[0]);
    });

    newProvider.on("connect", () => {
      console.log("connect");
    });

    setProvider(new Web3Provider(newProvider));
  }, []);
  
  const loadLogoutWeb3 = (provider) => {
    console.log('load', provider)
    if (!provider) {
      loadWeb3Modal();
    } else {
      logoutOfWeb3Modal();
    }
  }

  return (
      <Button 
        variant="contained" 
        color="primary"
        onClick={() => { loadLogoutWeb3(provider) }} 
      >
        {!provider ? "Connect Wallet" : "Disconnect Wallet"}
      </Button> 
  );
}

export default WalletButton;
