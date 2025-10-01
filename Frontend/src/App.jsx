import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Login isSignup />} /> {/* Signup same as login for OAuth */}
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;