
import React, { createContext, useState, useEffect } from 'react';
import { get, set } from './localStorage';
import { APPID_KEY } from './constants/constants';

export const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {
  const [appId, setAppId] = useState(get(APPID_KEY) || '');

  useEffect(() => {
    set(APPID_KEY, appId);
  }, [appId]);

  return (
    <GlobalContext.Provider value={{ appId, setAppId }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
