import React, { useState, useEffect, useCallback } from 'react';
import Button from '@material-ui/core/Button'
import './App.css';
import Web3 from 'web3';
import { FormControl, TextField } from '@material-ui/core';
import Paper from '@material-ui/core/Paper'
import  SearchAppBar from './components/header';
import { Web3Provider } from "@ethersproject/providers";
import { web3Modal, shortenAddress } from './utils/web3Modal';
import { makeStyles } from '@material-ui/core/styles';
import { abi } from './abis/IBPool.json';
import daiToken from './abis/DaiToken.json';
import realFundToken from './abis/RealFundTokenERC20.json';

import { TokenProvider, useToken } from './context/TokenContext';

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

const config = {
  realFundToken: "0x47a91E95716B2C0d9670a3FB98b0A24B84D96f07",
  daiContract: "0xA5F974438Ff347216D216Da660D647e777142969",
  poolContract: "0xe6d35F9fD28d4589a3757fe0a45C93616C74015D"

}

function App() {
  const classes = useStyles()
  // hooks 
  const [address, setAddress] = useState('');
  const [totalSupply, setTotalSupply] = useState(0);
  const [provider, setProvider] = useState();
  const [userAddress, setUserAddress] = useState('');
  const [userBalance, setBalance] = useState(1);
  const [userDai, setDAI] = useState(0);
  const [userRFD, setRFD] = useState(0);

  const [userSpotPrice, setSpotPrice] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(1);  
  const [tokenBalanceSwap, setTotalBalanceSwap] = useState('');
  const [web3Lib, setWeb3] = useState('');
  const [approved, setApproved] = useState(false);
  const [displayPrice, setDisplayPrice] = useState(userSpotPrice);


  
  /* Open wallet selection modal. */
  const swap = async ()  => {
    const contract = new web3Lib.eth.Contract(abi, config.poolContract);
  

    // web3Lib.eth.subscribe('LOG_SWAP', {
    //   address: config.poolContract,
    //   topics :['swapExactAmountIn']
    // }, function(error, result){
    //   if (!error)
    //       console.log('log', result);
    // });
  
    let priceWithSlippage = userSpotPrice * 105 / 100;

    priceWithSlippage = web3Lib.utils.fromWei(priceWithSlippage.toString(), 'ether');

    console.log('Realfund / Dai price->', web3Lib.utils.fromWei(userSpotPrice.toString(), 'ether'));
    console.log('token ', tokenBalance, priceWithSlippage, userSpotPrice,  userSpotPrice * tokenBalance)

    const swapResult = await contract.methods.swapExactAmountIn(config.realFundToken, web3Lib.utils.toWei(`${tokenBalance}`), config.daiContract, web3Lib.utils.toWei('0'), web3Lib.utils.toWei(priceWithSlippage)).send({from: "0x84ACb643A378282145b84FCb371a9e502bffe193"});
  
    // console.log('swp', swapResult)
    // const log = swapResult.logs[0].args;

    // console.log('RealFund tokens that enter into the pool:', web3Lib.utils.fromWei(log.tokenAmountIn.toString(), 'ether'));
    // console.log('Dai tokens that are removed from the pool:', web3Lib.utils.fromWei(log.tokenAmountOut.toString(), 'ether'));

    const price = await contract.methods.getSpotPrice(config.daiContract, config.realFundToken).call();
    console.log('spot price', price)

    console.log('Realfund / Dai new price->', web3Lib.utils.fromWei(price.toString(), 'ether'));

    setSpotPrice(price)
  }


  const approve = async (account) => {
    // real fund 
    const rfdContract = new web3Lib.eth.Contract(realFundToken.abi, config.realFundToken);
    const transfer = {
      from: "0x84ACb643A378282145b84FCb371a9e502bffe193",
      gas: web3Lib.utils.toWei('1000000'),
      gasPrice: '1000000',
    }
    await rfdContract.methods.approve(config.poolContract, web3Lib.utils.toTwosComplement(-1)).send({from: transfer.from});
    setApproved(true);
  }

  /* Open wallet selection modal. */
  const loadWeb3Modal = useCallback(async () => {
    console.log('Open modal')
    const newProvider = await web3Modal.connect();
    let web3 = new Web3(window.ethereum);
    let currentAddress = await web3.eth.getAccounts();
    let balance = await web3.eth.getBalance(currentAddress[0]);

    const daiContract = new web3.eth.Contract(daiToken.abi, config.daiContract);
    setDAI(await daiContract.methods.balanceOf(currentAddress[0]).call());
    //tokenContext({ dai: 10 });
    
    const rfdContract = new web3.eth.Contract(realFundToken.abi, config.realFundToken);
    setRFD(await rfdContract.methods.balanceOf(currentAddress[0]).call());


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

  parseFloat()
  return (
    <div className="App">
      <SearchAppBar 
        provider={provider} 
        loadWeb3Modal={loadWeb3Modal} 
        setProvider={setProvider}  
        setUserAddress={setUserAddress}
        setBalance={setBalance}
        setWeb3={setWeb3}
        setSpotPrice={setSpotPrice}
        setDAI={setDAI}
        setRFD={setRFD}
      />
      {/* {isConnected} */}
      
    

      {!window.ethereum && <h1>Please connect a wallet !</h1>}
      {window.ethereum && <p>Wallet: {shortenAddress(userAddress)} ETH: { Web3.utils.fromWei(`${userBalance}`, "ether") } DAI: { Web3.utils.fromWei(`${userDai}`, "ether") } RFD: { Web3.utils.fromWei(`${userRFD}`, "ether") } , </p>}
      <Paper className={classes.paper} elevation={6}> 
        <div className={classes.container}>
          <FormControl>
              <TextField
                  value={tokenBalance}
                  onInput={(e) => { 
                    setTokenBalance(`${e.target.value}`);
                    setDisplayPrice(parseFloat(userSpotPrice * tokenBalance));
                  }}
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
                  value={`${Web3.utils.fromWei(userSpotPrice.toString())} RFD`}
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
                  type="approve"
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={() => approve(userAddress)}
                  className={classes.submit}
                  disabled={approved}
                >
                  Approve
                </Button>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={() => swap()}
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

export default () => {
 return (
  <TokenProvider>
    <App></App>
  </TokenProvider>
 )
};
