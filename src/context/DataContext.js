import React, { useState, useContext } from "react";

const GlobalDataContext = React.createContext({});

const GlobalDataContextProvider = ({ children }) => {
  const [prices, setPrices] = useState([]);
  const [user, setUser] = useState(null);

  return (
    <GlobalDataContext.Provider value={{ prices, setPrices, user, setUser }}>
      {children}
    </GlobalDataContext.Provider>
  );
};

function useGlobalDataContext() {
  const context = useContext(GlobalDataContext);

  if (!context) {
    throw new Error(
      "useMaterialUIController should be used inside the MaterialUIControllerProvider."
    );
  }

  return context;
}

export {
  useGlobalDataContext,
  GlobalDataContextProvider,
  GlobalDataContext,
}
