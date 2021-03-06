import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { fade, makeStyles } from '@material-ui/core/styles';
import WalletButton from './WalletButton';
import logo from '../logo.jpg';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    background: '#fff',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  photo: {
    height: '30px',
    width: '150px' 
  }, 
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

export default function SearchAppBar({ provider, setProvider, loadWeb3Modal, setUserAddress, setBalance, setWeb3, setSpotPrice, setDAI, setRFD,  setDaiSpotPrice }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static" style={{ background: '#fff', color: '#000000' }}>
        <Toolbar>
          <img src={logo} alt="logo" className={classes.photo} />
          <Typography className={classes.title} variant="h6" noWrap>
            Real Estate Tokenization
          </Typography>
          <div className={classes.search}>
            <WalletButton 
              provider={provider} 
              loadWeb3Modal={loadWeb3Modal} 
              setProvider={setProvider} 
              setUserAddress={setUserAddress} 
              setBalance={setBalance}
              setWeb3={setWeb3}
              setSpotPrice={setSpotPrice}
              setDaiSpotPrice={setDaiSpotPrice}
              setDAI={setDAI} 
              setRFD={setRFD}  
            />
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
