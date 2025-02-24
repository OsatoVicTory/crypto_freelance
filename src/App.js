// import { useContext } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import AppMain from './AppMain';
import Registration from './pages/registration';
import UserRegistration from './pages/registration/userForm';
import HirerRegistration from './pages/registration/hirerForm';
import LogIn from './pages/firstPage';

// var wsProvider = new ethers.providers.WebSocketProvider("wss://rinkeby.infura.io/ws/v3/idhere");

// let contract = new ethers.Contract(contractAddress, CONTRACT_ABI, wsProvider);

// contract.on("*", (from, to, value, event) => {
//   console.log("event: ", event);
// });

// 59e9f0865eea4b65a8feff38b21510f3 // key infura
// mgGlXka3gbcPQhA+TB1Rd8afza7uEE2tRbqYWwrcXZdU2hwIZRfOwA // secret infura

// 0x8dE499E209E0b05cB66cE4A1b975956beC173BFD // other guys address seeking testnet tokens

function App() {

  return (
    <div className="App">
    <Routes>
        <Route path="/" element={<LogIn />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/register-user" element={<UserRegistration />} />
        <Route path="/register-hirer" element={<HirerRegistration />} />
        <Route path='/app/*' element={<AppMain />} />
      </Routes>
    </div>
  );
}

export default App;
