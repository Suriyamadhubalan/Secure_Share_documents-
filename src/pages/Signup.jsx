import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase"; // Import Supabase client
import AlertMessage from "../components/AlertMessage";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [full_name, setFullName] = useState("");
  const [phone_number, setPhone] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [alert, setAlert] = useState(null);

  const showAlert = (message, color) => {
    setAlert({ message, color });
    setTimeout(() => setAlert(null), 3000); // Auto-hide after 2s
  };

  const handleSignup = async () => {
    try {
      const data = await signup(email, password); // Ensure data is received

      const { error: emailError } = await supabase.auth.signInWithOtp({
        email,
      });
      
      if (!data) throw new Error("Signup failed");
  
      setStep(2); // Move to OTP verification
    } catch (error) {
      console.error("Signup Error:", error.message);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp === "123456") { // Replace with actual OTP validation logic
      try {
        // Sign in the user first to ensure there's an active session
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (loginError) throw loginError;

        // Now that the user is logged in, proceed with storing details
        const { error } = await supabase.from("users").insert([
          { full_name: full_name, phone_number, aadhaar, email, created_at: new Date() }
        ]);

        if (error) throw error;

        showAlert("User registered successfully!", "green");
        setTimeout(() => navigate("/Upload"), 3000);
        // Redirect after successful registration
      } catch (error) {
        console.error("Database Error:", error.message);
      }
    } else {
      // alert("Invalid OTP");
      showAlert("Invalid OTP", "red");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-800 text-white">
      <div className="p-6 bg-gray-900 rounded-lg shadow-lg w-96">
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Secure Signup</h2>
            <input
              type="text"
              placeholder="Full Name"
              value={full_name}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={phone_number}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
            />
            <input
              type="text"
              placeholder="Aadhaar Number"
              value={aadhaar}
              onChange={(e) => setAadhaar(e.target.value)}
              className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
            />
            <button onClick={handleSignup} className="w-full bg-green-500 p-2 rounded">
              Signup
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold mb-4">OTP Verification</h2>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
            />
            <button onClick={handleVerifyOTP} className="w-full bg-blue-500 p-2 rounded">
              Verify OTP & Register
            </button>
          </div>
        )}
      </div>
      {alert && <AlertMessage {...alert} />}
    </div>
  );
};

export default Signup;
