import React, { useState, useEffect, useCallback } from 'react';
import Button from '@material-ui/core/Button'
import './App.css';
import Web3 from 'web3';
import { FormControl, InputLabel, Input, FormHelperText, TextField } from '@material-ui/core';
import  SearchAppBar from './components/header';
import { Web3Provider, getDefaultProvider } from "@ethersproject/providers";
import { web3Modal, logoutOfWeb3Modal } from './utils/web3Modal';
import { makeStyles } from '@material-ui/core/styles';

async function readOnChainData() {

  // empty function for later protocols

}

const useStyles = makeStyles((theme) => ({
  paper: {
    width: 'auto',
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(620 + theme.spacing(6))]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(
      3
    )}px`,
  },
  avatar: {
    margin: theme.spacing(1),
    width: 192,
    height: 192,
    color: theme.palette.secondary.main,
  },
  form: {
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: `100%`,
  },
}))

function App() {
  const classes = useStyles()
  // hooks 
  const [address, setAddress] = useState('');
  const [totalSupply, setTotalSupply] = useState(0);
  const [provider, setProvider] = useState();
  const [userAddress, setUserAddress] = useState();
  const [userBalance, setBalance] = useState(0);
  const [tokenBalance, setTokenBalance] = useState('')
  const [tokenBalanceSwap, setTotalBalanceSwap] = useState('')
  


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
          <TextField
              value={userBalance}
              onInput={(e) => setTokenBalance(e.target.value)}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label='username'
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              value={userBalance}
            //  onInput={(e) => setPassword(e.target.value)}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label='label'
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Swap
            </Button>
      </FormControl>



    </div>
  );
}

export default App;
