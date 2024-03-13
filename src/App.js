import './App.css';
import { useState } from 'react';
import Nav from "./components/Nav";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Login from './pages/Login';
import Graph from './pages/Graph';
// import useToken from './components/useToken';
 
function App() {
  const [token, setToken] = useState();

  if(!token) {
    return <Login setToken={setToken} />
  }

  return (
      <Router>
          <Nav />
          <Routes>
              <Route exact path="/" element={<Login />} />
              <Route path="/home" element={<Graph />} />
          </Routes>
      </Router>
  );
}

export default App;