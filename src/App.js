import React, { useState, useEffect } from 'react';
import './App.css';
import Web3 from 'web3';
import dawnAbi from './abis/dawn';
import cBAT from './abis/cBAT';
import { FormControl } from '@material-ui/core';
import  SearchAppBar from './components/header';

function App() {
  const [address, setAddress] = useState('');
  const [totalSupply, setTotalSupply] = useState(0);
  const contractAddress = '0x580c8520dEDA0a441522AEAe0f9F7A5f29629aFa';
  const cBatAddress = '0x6C8c6b02E7b2BE14d4fA6022Dfd6d75921D90E4E';

  useEffect( async () => {
    let web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
    const contract = new web3.eth.Contract(cBAT, cBatAddress);
    console.log(contract.methods)
    let supply = await contract.methods.totalSupply().call();
    setTotalSupply(supply);
  });
 
  window.ethereum.on('accountsChanged', function (accounts) {
    const account = accounts[0];
    // do something with new account here
    setAddress(account)
  })

  return (
    <div className="App">
      <SearchAppBar />
      {/* {isConnected} */}
      
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
