import React, { useCallback, useState } from 'react';
import Button from '@material-ui/core/Button';
import { web3Modal, logoutOfWeb3Modal } from '../utils/web3Modal';
import { Web3Provider, getDefaultProvider } from "@ethersproject/providers";
import Web3 from 'web3';

const WalletButton = ({ provider, setProvider, setUserAddress, setBalance }) => {

  const loadWeb3Modal = useCallback(async () => {
    const newProvider = await web3Modal.connect();
    let web3 = new Web3(window.ethereum);
    let currentAddress = await web3.eth.getAccounts();
    let balance = await web3.eth.getBalance(currentAddress[0]);
    setProvider(new Web3Provider(newProvider));
    setUserAddress(currentAddress[0]);
    setBalance(balance);

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
