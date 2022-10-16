import './App.css';
import  io  from 'socket.io-client';
import Home from './Components/Home/Home';
import { Routes, Route } from 'react-router-dom'
import AuthRoute from './Firebase/useContext';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './Firebase/Secret';
import Register from './Components/Register/register';
import Login from './Components/Login/Login';
import { ChakraProvider } from '@chakra-ui/react'

const socket = io("http://localhost:3001");
initializeApp(firebaseConfig)


function App() {
  return (
    <ChakraProvider>
      <Routes>
        <Route path='/home' element={<AuthRoute><Home/></AuthRoute>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>      
      </Routes>
    </ChakraProvider>
  );
}

export default App;
