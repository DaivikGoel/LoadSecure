import React, { createContext, useState,  useContext } from 'react';

const GlobalStateContext = createContext(null);

export const GlobalStateProvider = ({ children }) => {
  const [currentCreator, setCurrentCreator] = useState(null);
 const [selectedBusiness,setSelectedBusiness ] = useState(null);
 const [businessCreators, setBusinessCreators] = useState(null)

  return (
    <GlobalStateContext.Provider value={{ currentCreator, setCurrentCreator, selectedBusiness,setSelectedBusiness, businessCreators, setBusinessCreators }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);