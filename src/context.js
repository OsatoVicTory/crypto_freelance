import { createContext, useState } from 'react';

const AppContext = createContext({
    contract: {},
    setContract: () => {},
    message: {},
    setMessage: () => {},
    user: {},
    setUser: () => {},
    wallet: '',
    setWallet: () => {},
});

const AppProvider = ({ children }) => {
    const [contract, setContract] = useState({});
    const [message, setMessage] = useState({});
    const [user, setUser] = useState({});
    const [wallet, setWallet] = useState('');

    return (
        <AppContext.Provider value={{ 
            contract, setContract, message, setMessage, 
            user, setUser, wallet, setWallet
        }}>
            {children}
        </AppContext.Provider>
    );
};

export { AppContext, AppProvider };