import { useContext } from 'react';
import './App.css';
import Pages from './pages';
import { AppContext } from './context';
import NoWallet from './components/errorWallet';

// var wsProvider = new ethers.providers.WebSocketProvider("wss://rinkeby.infura.io/ws/v3/idhere");

// let contract = new ethers.Contract(contractAddress, CONTRACT_ABI, wsProvider);

// contract.on("*", (from, to, value, event) => {
//   console.log("event: ", event);
// });

// 59e9f0865eea4b65a8feff38b21510f3 // key infura
// mgGlXka3gbcPQhA+TB1Rd8afza7uEE2tRbqYWwrcXZdU2hwIZRfOwA // secret infura

// 0x8dE499E209E0b05cB66cE4A1b975956beC173BFD // other guys address seeking testnet tokens

function AppMain() {
  const { contract, user } = useContext(AppContext);

  return (
    <div className="App-Main">
    {
      !contract.address ?
      <NoWallet /> :
      <Pages />
    }
    </div>
  );
}

export default AppMain;
