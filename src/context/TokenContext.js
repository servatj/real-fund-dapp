import React, { useMemo }  from 'react';

const TokenContext = React.createContext({ eth: 0, rfd: 0, dai: 0 })

export function TokenProvider(props) {
  const value = useMemo(() => {
   return ({
     eth: props.eth,
     rfd: props.rfd,
     dai: props.dai
   });
  });

  return <TokenContext.Provider value={value} {...props} />
}

export const useToken = () => {
  const context = React.useContext(TokenProvider);
  if (!context) {
    console.log('no context error');
  }
  return context;
}
