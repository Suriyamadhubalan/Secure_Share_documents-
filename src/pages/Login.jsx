import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabase"; // Import Supabase client

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      console.error("Login Error:", error.message);
    } else {
      navigate("/Upload"); // Redirect after login
    }
  };

  const handlePasswordReset = async () => {
    setResetMessage(null);
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: "http://yourdomain.com/reset-password", // Replace with your actual reset page URL
    });

    if (error) {
      setResetMessage({ type: "error", text: error.message });
      console.error("Password Reset Error:", error.message);
    } else {
      setResetMessage({ type: "success", text: "Password reset email sent. Check your inbox!" });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
      <div className="p-6 bg-gray-800 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-yellow-400">Secure Login</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Login Form */}
        {!showReset ? (
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
              required
            />
            <button
              type="submit"
              className="w-full bg-yellow-500 text-gray-900 p-2 rounded font-semibold hover:bg-yellow-600 transition"
            >
              Login
            </button>
          </form>
        ) : (
          // Password Reset Section
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
              required
            />
            <button
              onClick={handlePasswordReset}
              className="w-full bg-yellow-500 text-gray-900 p-2 rounded font-semibold hover:bg-yellow-600 transition"
            >
              Send Password Reset Link
            </button>
            {resetMessage && (
              <p className={`mt-2 text-sm ${resetMessage.type === "success" ? "text-green-400" : "text-red-400"}`}>
                {resetMessage.text}
              </p>
            )}
          </div>
        )}

        {/* Toggle Links */}
        <p className="text-sm mt-4 text-gray-400">
          {!showReset ? (
            <span className="text-sm mt-4 text-gray-400">
              Don't have an account? <Link to="/signup" className="text-yellow-400 hover:underline">Sign up</Link> |
              <button onClick={() => setShowReset(true)} className="text-yellow-400 hover:underline ml-2">
                Forgot Password?
              </button>
            </span>
          ) : (
            <button onClick={() => setShowReset(false)} className="text-yellow-400 hover:underline">
              Back to Login
            </button>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;
