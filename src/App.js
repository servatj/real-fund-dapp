import React, { useState, useEffect, useCallback } from 'react';
import Button from '@material-ui/core/Button'
import './App.css';
import Web3 from 'web3';
import { FormControl, FormLabel, InputLabel, Input, FormHelperText, TextField } from '@material-ui/core';
import Paper from '@material-ui/core/Paper'
import  SearchAppBar from './components/header';
import { Web3Provider, getDefaultProvider } from "@ethersproject/providers";
import { web3Modal, logoutOfWeb3Modal } from './utils/web3Modal';
import { makeStyles } from '@material-ui/core/styles';

const swap = (amount)  => {

  // empty function for later protocols
  alert(`swap ${amount}`)

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
    let web3 = new Web3(window.ethereum);
    let currentAddress = await web3.eth.getAccounts();
    let balance = await web3.eth.getBalance(currentAddress[0]);
    setProvider(new Web3Provider(newProvider));
    setUserAddress(currentAddress[0]);
    setBalance(balance);
  }, []);

  /* If user has loaded a wallet before, load it automatically. */
  useEffect( async () => {
    console.log('effect')
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    } else {
      if(provider) {
        console.log(' provider ')
        let web3 = new Web3(window.ethereum);
       // console.log('is connected', web3.isConnected());
        console.log('address', await web3.eth.getAccounts());  
        setUserAddress(await web3.eth.getAccounts()[0]);
  
        if (userAddress) {
          const balance = await web3.eth.getBalance(userAddress);
          setBalance(balance);
        }
      }
    }
  }, [loadWeb3Modal]);

  return (
    <div className="App">
      <SearchAppBar 
        provider={provider} 
        loadWeb3Modal={loadWeb3Modal} 
        setProvider={setProvider}  
        setUserAddress={setUserAddress}
        setBalance={setBalance}/>
      {/* {isConnected} */}
      

      {!window.ethereum && <h1>Please connect a wallet !</h1>}
      {window.ethereum && <p>Your Ethereum address is: {userAddress} {userBalance}, </p>}
      <Paper className={classes.paper} elevation={6}> 
        <div className={classes.container}>
          <FormControl>
              <TextField
                  value={tokenBalance}
                  onInput={(e) => setTokenBalance(e.target.value)}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="amountBase"
                  label='amount'
                  name="amountBase"
                  autoComplete="amountBase"
                  autoFocus
                />
                <TextField
                  value={userBalance}
                  disabled={true}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="amountQuote"
                  id="amountQuote"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={() => swap(tokenBalance)}
                  className={classes.submit}
                >
                  Swap
                </Button>
          </FormControl> 
        </div>
      </Paper>
    </div>
  );
}

export default App;
