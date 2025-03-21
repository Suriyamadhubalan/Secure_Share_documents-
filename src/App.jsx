import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from './pages/LandingPage'
import Signup from './pages/Signup'
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Upload from './pages/Upload';
import ViewDocuments from './pages/ViewDocuments';
import Profile from './pages/Profile';

function App() {

  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Upload" element={<Upload />} />
        <Route path="/ViewDocuments" element={<ViewDocuments />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  )
}

export default App
