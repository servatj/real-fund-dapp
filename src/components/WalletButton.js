import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import Button from '@material-ui/core/Button';

const WalletButton = () => {
  return (
    <Button variant="contained" color="primary">
      Connect wallet 
    </Button> 
  );
}

export default WalletButton;
