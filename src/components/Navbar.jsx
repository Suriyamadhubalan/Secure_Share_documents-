import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth(); // Get user authentication status
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false); // Close menu after logging out
    navigate("/");
  };

  return (
    <nav className="bg-gray-900 text-gray-100 shadow-md p-4 border-b border-yellow-500">
      <div className="container mx-auto flex justify-between items-center">
        {/* Navigation Links (Aligned Left) */}
        <div className="flex items-center space-x-6">
          {/* Logo */}
          <Link to="/" className="text-yellow-400 text-xl font-bold">
            SecureDocs
          </Link>

          {user ? (
            <>
              <Link to="/ViewDocuments" className="hover:text-yellow-400 transition">View</Link>
              <Link to="/Upload" className="hover:text-yellow-400 transition">Upload</Link>
            </>
          ) : (
            <>
              <Link to="/" className="hover:text-yellow-400 transition">Home</Link>
              <Link to="/features" className="hover:text-yellow-400 transition">Features</Link>
              <Link to="/about" className="hover:text-yellow-400 transition">About</Link>
              <Link to="/contact" className="hover:text-yellow-400 transition">Contact</Link>
            </>
          )}
        </div>

        {/* Authentication Buttons / Profile */}
        <div>
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setMenuOpen(!menuOpen)} 
                className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center"
              >
                👤
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-md shadow-lg py-2">
                  <Link 
                    to="/profile" 
                    className="block px-4 py-2 text-gray-100 hover:bg-gray-700"
                    onClick={() => setMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="block w-full text-left px-4 py-2 text-gray-100 hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-x-4">
              <Link 
                to="/login" 
                className="px-4 py-2 border border-yellow-500 text-yellow-500 rounded hover:bg-yellow-500 hover:text-gray-900 transition"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="px-4 py-2 bg-yellow-500 text-gray-900 rounded hover:bg-yellow-600 transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
