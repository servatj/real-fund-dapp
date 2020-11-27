import React, { useCallback } from 'react';
import Button from '@material-ui/core/Button';
import { web3Modal, logoutOfWeb3Modal } from '../utils/web3Modal';
import { Web3Provider } from "@ethersproject/providers";
import Web3 from 'web3';
import daiToken from '../abis/DaiToken.json';
import realFundToken from '../abis/RealFundTokenERC20.json';
import balancerPool from '../abis/IBPool.json';

const WalletButton = ({ provider, setProvider, setUserAddress, setBalance, setWeb3, setSpotPrice, setDAI, setRFD, setDaiSpotPrice }) => {

  const config = {
    realFundToken: "0x65516Eef4dCfd360F8CAE4B10A51CDe25b4aD6E9",
    daiContract: "0xc4D4A81631978e5096bC60C18Af385a7284EF24C",
    poolContract: "0x7E67499Bafdc6EdA887461937A1AB16b532f856B"
  }

  const loadWeb3Modal = useCallback(async () => {""
    const newProvider = await web3Modal.connect();    
    let web3 = new Web3(window.ethereum);
    let currentAddress = await web3.eth.getAccounts();
    let balance = await web3.eth.getBalance(currentAddress[0]);

    const daiContract = new web3.eth.Contract(daiToken.abi, config.daiContract);
    setDAI(await daiContract.methods.balanceOf(currentAddress[0]).call());
    
    const rfdContract = new web3.eth.Contract(realFundToken.abi, config.realFundToken);
    setRFD(await rfdContract.methods.balanceOf(currentAddress[0]).call());

    const poolContract = new web3.eth.Contract(balancerPool.abi, config.poolContract);
    console.log(poolContract, config.realFundToken, config.daiContract, config.poolContract);

    const spotPrice = await poolContract.methods.getSpotPrice(config.daiContract, config.realFundToken).call();
    console.log('spot price', spotPrice);

    const spotDaiPrice = await poolContract.methods.getSpotPrice(config.daiContract, config.realFundToken).call();
    console.log('spot price', spotPrice);
    
    setProvider(new Web3Provider(newProvider));
    setUserAddress(currentAddress[0]);
    setBalance(balance);
    setWeb3(web3);
    setSpotPrice(spotPrice);
    setDaiSpotPrice(spotDaiPrice);

    newProvider.on("accountsChanged", accounts => {
      console.log("accountsChanged", accounts);
      setUserAddress(accounts[0]);
    });

    newProvider.on("connect", () => {
      console.log("connect");
    });

    setProvider(new Web3Provider(newProvider));
  }, [
     config.daiContract,
     config.poolContract, 
     config.realFundToken, 
     setBalance, 
     setDAI, 
     setDaiSpotPrice, 
     setProvider, 
     setRFD, 
     setSpotPrice, 
     setUserAddress,
     setWeb3
  ]);
  
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
