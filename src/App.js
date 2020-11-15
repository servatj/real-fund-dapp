import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Web3 from 'web3';
import dawnAbi from './abis/dawn';
import cBAT from './abis/cBAT';
import { FormControl } from '@material-ui/core';
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

  // useEffect( async () => {
  //   let web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
  //   const contract = new web3.eth.Contract(cBAT, cBatAddress);
  //   let supply = await contract.methods.totalSupply().call();
  //   setTotalSupply(supply);
  // });

  // if(window.ethereum) {
  //   window.ethereum.on('accountsChanged', function (accounts) {
  //     const account = accounts[0];
  //     // do something with new account here
  //     setAddress(account)
  //   })
  // }
  
 
  return (
    <div className="App">
      <SearchAppBar provider={provider} loadWeb3Modal={loadWeb3Modal} setProvider={setProvider} />
      {/* {isConnected} */}
      

      {!window.ethereum && <h1>Please connect a wallet !</h1>}
      {window.ethereum && <p>Your Ethereum address is: {contractAddress} {totalSupply}, </p>}


      {/* <FormControl>
        <InputLabel htmlFor="my-input">Email address</InputLabel>
        <Input id="my-input" aria-describedby="my-helper-text" />
        <FormHelperText id="my-helper-text">We'll never share your email.</FormHelperText>
      </FormControl> */}
    </div>
  );
}

export default App;
