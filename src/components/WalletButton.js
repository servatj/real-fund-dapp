import React, { useCallback, useState } from 'react';
import Button from '@material-ui/core/Button';
import { web3Modal, logoutOfWeb3Modal } from '../utils/web3Modal';
import { Web3Provider, getDefaultProvider } from "@ethersproject/providers";

const WalletButton = ({ provider, setProvider, setUserAddress}) => {

  const loadWeb3Modal = useCallback(async () => {
    const newProvider = await web3Modal.connect();
   
    newProvider.on("accountsChanged", accounts => {
      console.log("accountsChanged", accounts);
      setUserAddress(accounts[0]);
    });

    newProvider.on("connect", (accounts) => {
      console.log("connect", accounts[0]);
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
