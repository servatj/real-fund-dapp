import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Web3 from 'web3';
import dawnAbi from './abis/dawn';
import cBAT from './abis/cBAT';
import { FormControl, InputLabel, Input, FormHelperText } from '@material-ui/core';
import  SearchAppBar from './components/header';
import { Web3Provider, getDefaultProvider } from "@ethersproject/providers";
import { web3Modal, logoutOfWeb3Modal } from './utils/web3Modal'

async function readOnChainData() {

  // empty function for later protocols

}

function App() {
  const [address, setAddress] = useState('');
  const [totalSupply, setTotalSupply] = useState(0);
  const [provider, setProvider] = useState();
  const [userAddress, setUserAddress] = useState();
  const [userBalance, setBalance] = useState(0);


  async function getBalances(web3) {
    const accounts = await web3.eth.getAccounts()
    console.log(accounts[0])
  }

  /* Open wallet selection modal. */
  const loadWeb3Modal = useCallback(async () => {
    const newProvider = await web3Modal.connect();
    setProvider(new Web3Provider(newProvider));
  }, []);

  /* If user has loaded a wallet before, load it automatically. */
  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);


  const contractAddress = '0x580c8520dEDA0a441522AEAe0f9F7A5f29629aFa';

  useEffect( async () => {
    if(provider) {
      console.log(provider)
      let web3 = new Web3(window.ethereum);
     // console.log('is connected', web3.isConnected());
      console.log('address', userAddress);  
      web3.eth.getAccounts(console.log);

      if (userAddress) {
        const balance = await web3.eth.getBalance(userAddress);
        setBalance(balance);
      }
    }
  });

  // if(window.ethereum) {
  //   window.ethereum.on('accountsChanged', function (accounts) {
  //     const account = accounts[0];
  //     // do something with new account here
  //     setAddress(account)
  //   })
  // }
  
  return (
    <div className="App">
      <SearchAppBar 
        provider={provider} 
        loadWeb3Modal={loadWeb3Modal} setProvider={setProvider}  setUserAddress={setUserAddress}/>
      {/* {isConnected} */}
      

      {!window.ethereum && <h1>Please connect a wallet !</h1>}
      {window.ethereum && <p>Your Ethereum address is: {userAddress} {userBalance}, </p>}

      <FormControl>
        <InputLabel htmlFor="my-input">Email address</InputLabel>
        <Input id="my-input" aria-describedby="my-helper-text" />
        <FormHelperText id="my-helper-text">We'll never share your email.</FormHelperText>
      </FormControl>
    </div>
  );
}

export default App;
