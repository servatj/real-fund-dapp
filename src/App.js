import React, { useState, useEffect, useCallback } from 'react';
import Button from '@material-ui/core/Button'
import './App.css';
import Web3 from 'web3';
import { FormControl, TextField, InputLabel, Input, FormHelperText } from '@material-ui/core';
import Paper from '@material-ui/core/Paper'
import  SearchAppBar from './components/header';
import { Web3Provider } from "@ethersproject/providers";
import { web3Modal, shortenAddress } from './utils/web3Modal';
import { makeStyles } from '@material-ui/core/styles';
import { abi } from './abis/IBPool.json';
import daiToken from './abis/DaiToken.json';
import realFundToken from './abis/RealFundTokenERC20.json';
import Typography from '@material-ui/core/Typography';

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
  realFundToken: "0x65516Eef4dCfd360F8CAE4B10A51CDe25b4aD6E9",
  daiContract: "0xc4D4A81631978e5096bC60C18Af385a7284EF24C",
  poolContract: "0x7E67499Bafdc6EdA887461937A1AB16b532f856B"

}

const userWhiteList = [];

function App() {
  const classes = useStyles()
  // hooks 
  const [provider, setProvider] = useState();
  const [userAddress, setUserAddress] = useState('');
  const [userBalance, setBalance] = useState(1);
  const [userDai, setDAI] = useState(0);
  const [userRFD, setRFD] = useState(0);
  const [userSpotPrice, setSpotPrice] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(1);  
  const [web3Lib, setWeb3] = useState('');
  const [approved, setApproved] = useState(false);
  const [approvedDai, setApprovedDai] = useState(false);
  const [tokenDaiBalance, setTokenDaiBalance] = useState(1);  
  const [userDaiSpotPrice, setDaiSpotPrice] = useState(0);
  const [whiteListAddress, setWhiteListAddress] = useState('');
  // const [displayPrice, setDisplayPrice] = useState(userDaiSpotPrice);
  // const [displayDaiPrice, setDisplayDaiPrice] = useState(userDaiSpotPrice);


  
  const addToWhiteList = async (user) => {
    console.log('user', user)

    const formatedUser = web3Lib.utils.toChecksumAddress(user);
    console.log('user', user, formatedUser)
    userWhiteList.push(user);
    const realFundErc20Contract = new web3Lib.eth.Contract(realFundToken.abi, config.realFundToken);
    await realFundErc20Contract.methods.addToWhitelist(formatedUser).send({ from: userAddress });
    
    //addToWhiteList(user)
    
    
  // .send({ from: userAddress });
    console.log(`user ${user} added to the white list`)
  }

  /* Open wallet selection modal. */
  const swap = async ()  => {
    const contract = new web3Lib.eth.Contract(abi, config.poolContract);

    let priceWithSlippage = userSpotPrice * 140 / 100;

    priceWithSlippage = web3Lib.utils.fromWei(priceWithSlippage.toString(), 'ether');

    console.log('Realfund / Dai price->', web3Lib.utils.fromWei(userSpotPrice.toString(), 'ether'));
    console.log('token ', tokenBalance, priceWithSlippage, userSpotPrice,  userSpotPrice * tokenBalance)

    await contract.methods.swapExactAmountIn(config.realFundToken, web3Lib.utils.toWei(`${tokenBalance}`), config.daiContract, web3Lib.utils.toWei('0'), web3Lib.utils.toWei(priceWithSlippage)).send({from: userAddress });
    const price = await contract.methods.getSpotPrice(config.daiContract, config.realFundToken).call();
    console.log('spot price', price)
    console.log('Realfund / Dai new price->', web3Lib.utils.fromWei(price.toString(), 'ether'));
    setSpotPrice(price)
  }

  const swapDai = async ()  => {
    const contract = new web3Lib.eth.Contract(abi, config.poolContract);

    let priceWithSlippage = userDaiSpotPrice * 140 / 100;

    priceWithSlippage = web3Lib.utils.fromWei(priceWithSlippage.toString(), 'ether');

    console.log('Dai price / Realfund ->', web3Lib.utils.fromWei(userDaiSpotPrice.toString(), 'ether'));
    console.log('token ', tokenDaiBalance, priceWithSlippage, userDaiSpotPrice,  userDaiSpotPrice * tokenDaiBalance)

    await contract.methods.swapExactAmountIn(config.daiContract, web3Lib.utils.toWei(`${tokenDaiBalance}`), config.realFundToken, web3Lib.utils.toWei('0'), web3Lib.utils.toWei(priceWithSlippage)).send({from: userAddress });
    const price = await contract.methods.getSpotPrice(config.daiContract, config.realFundToken).call();
    console.log('spot price', price)
    console.log('Dai new price / Realfund ->', web3Lib.utils.fromWei(price.toString(), 'ether'));
    setSpotPrice(price)
  }


  const approve = async (account) => {
    // real fund 
    const rfdContract = new web3Lib.eth.Contract(realFundToken.abi, config.realFundToken);
    await rfdContract.methods.approve(config.poolContract, web3Lib.utils.toTwosComplement(-1)).send({from: userAddress});
    setApproved(true);
  }

  const approveDai = async (account) => {
    // real fund 
    const rfdContract = new web3Lib.eth.Contract(daiToken.abi, config.daiContract);
    await rfdContract.methods.approve(config.poolContract, web3Lib.utils.toTwosComplement(-1)).send({from: userAddress});
    setApprovedDai(true);
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
  useEffect( () => {
    const wrapper = async () =>{
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
    }
    wrapper();
    console.log('effect') 
  });

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
        setTokenDaiBalance={setTokenDaiBalance}
        setDaiSpotPrice={setDaiSpotPrice}
      />
      {/* {isConnected} */}
      
      {!window.ethereum && <h1>Please connect a wallet !</h1>}
      {window.ethereum && <p>Wallet: {shortenAddress(userAddress)} ETH: { Web3.utils.fromWei(`${userBalance}`, "ether") } DAI: { Web3.utils.fromWei(`${userDai}`, "ether") } RFD: { Web3.utils.fromWei(`${userRFD}`, "ether") } , </p>}
      <FormControl>
        <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={(e) => window.open('https://kovan.pools.balancer.exchange/#/pool/0x7E67499Bafdc6EdA887461937A1AB16b532f856B/', '_blank')}
            className={classes.submit}
        >
          visit balancer pool
        </Button>
      </FormControl>
      <Paper className={classes.paper} elevation={6}> 
        <div className={classes.container}>
          <FormControl>
              <Typography component="h1" variant="h5">
                SWAP RFD to DAI
              </Typography>
              <TextField
                  value={tokenBalance}
                  onInput={(e) => { 
                    setTokenBalance(`${e.target.value}`);
                    // setDisplayPrice(parseFloat(userSpotPrice * tokenBalance));
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

      <br></br>
      <br></br>
      <br></br>

      <FormControl>
            <InputLabel htmlFor="my-input" >Add user to whitelist</InputLabel>
            <Input  onInput={(e) => { setWhiteListAddress(`${e.target.value}`) }} id="my-input" aria-describedby="my-helper-text" />
            <FormHelperText id="my-helper-text">Enter a valid account</FormHelperText>
            <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={(e) => addToWhiteList(whiteListAddress)}
                  className={classes.submit}
                >
                  Add
            </Button>
      </FormControl>

      <Paper className={classes.paper} elevation={6}> 
        <div className={classes.container}>
          <FormControl>
          <Typography component="h1" variant="h5">
            SWAP DAI to RFD
          </Typography>
              <TextField
                  value={tokenDaiBalance}
                  onInput={(e) => {
                    setTokenDaiBalance(`${e.target.value}`);
                    // setDisplayPrice(parseFloat(userDaiSpotPrice * tokenDaiBalance));
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
                  value={`${Web3.utils.fromWei(userDaiSpotPrice.toString())} DAI`}
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
                  onClick={() => approveDai(userAddress)}
                  className={classes.submit}
                  disabled={approvedDai}
                >
                  Approve
                </Button>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={() => swapDai()}
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
