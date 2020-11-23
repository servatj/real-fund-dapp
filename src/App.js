import React, { useState, useEffect, useCallback } from 'react';
import Button from '@material-ui/core/Button'
import './App.css';
import Web3, { eth } from 'web3';
import { FormControl, FormLabel, InputLabel, Input, FormHelperText, TextField } from '@material-ui/core';
import Paper from '@material-ui/core/Paper'
import  SearchAppBar from './components/header';
import { Web3Provider, getDefaultProvider } from "@ethersproject/providers";
import { web3Modal, logoutOfWeb3Modal, shortenAddress } from './utils/web3Modal';
import { makeStyles } from '@material-ui/core/styles';
import { abi } from './abis/RealFundSwap.json';
import NumberFormat from 'react-number-format';

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
  display: {
    background: '#1abc9c',
    color: 'white'
  },
  input: {
    color: 'white'
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
  const [userAddress, setUserAddress] = useState('');
  const [userBalance, setBalance] = useState(0);
  const [tokenBalance, setTokenBalance] = useState('');
  const [tokenBalanceSwap, setTotalBalanceSwap] = useState('');
  const [web3Lib, setWeb3] = useState('');

  
  const swap = async (amount)  => {
    const realFundContract = '0x8a7234F12a67B4972cB85787FE0224187a902413';
    const contract = new web3Lib.eth.Contract(abi, realFundContract);
    const result = await contract.methods.swapRealfundForDai(web3Lib.utils.toWei(amount)).call();
    console.log('swap', result);
  }
  

  /* Open wallet selection modal. */
  const loadWeb3Modal = useCallback(async () => {
    const newProvider = await web3Modal.connect();
    let web3 = new Web3(window.ethereum);
    let currentAddress = await web3.eth.getAccounts();
    let balance = await web3.eth.getBalance(currentAddress[0]);
    //const formatAddress = `${currentAddress[0].substring(0, 4 + 2)}...${currentAddress[0].substring(42 - 4)}`
    setProvider(new Web3Provider(newProvider));
    setUserAddress(currentAddress[0]);
    setBalance(balance);
    setWeb3(web3);
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
        setBalance={setBalance}
        setWeb3={setWeb3}
      />
      {/* {isConnected} */}
      

      {!window.ethereum && <h1>Please connect a wallet !</h1>}
      {window.ethereum && <p>Your Ethereum address is: {shortenAddress(userAddress)} {userBalance}, </p>}
      <Paper className={classes.paper} elevation={6}> 
        <div className={classes.container}>
          <FormControl>
              <TextField
                  value={tokenBalance}
                  onInput={(e) => setTokenBalance(`${e.target.value}`)}
                  variant="outlined"
                  margin="normal"
                 // customInput={TextField}
                  required
                  fullWidth
                  id="amountBase"
                  label='amount'
                  name="amountBase"
                  autoComplete="amountBase"
                  autoFocus
                />
                <TextField
                  className={classes.display}
                  value={`${userBalance} RFD`}
                  disabled={true}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="amountQuote"
                  id="amountQuote"
                  InputProps={{
                    classes: {
                      input: classes.input,
                    },
                  }}
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
