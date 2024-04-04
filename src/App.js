import './App.css';
import Nav from "./components/Nav";
import Footer from './components/Footer';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Auth from './pages/Auth';
import Home from './pages/Home';
 
function App() {
  const token = localStorage.getItem('token');

  if(!token) {
    return <Auth />
  }

  return (
      <Router>
          <Nav />
          <Routes>
              <Route path="/" element={<Home />} />
          </Routes>
          <Footer />
      </Router>
  );
}

export default App;