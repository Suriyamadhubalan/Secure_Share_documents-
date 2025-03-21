import { Link } from "react-router-dom";
import coverImage from "../assets/cover_image2.jpeg"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Hero Section */}
      <div className="min-h-[80vh] flex flex-col md:flex-row items-center justify-center text-center md:text-left px-8">
        {/* Text Content */}
        <div className="md:w-1/2">
          <h1 className="text-5xl font-extrabold text-yellow-400 leading-tight mb-4">
            Secure & Share Your Government Documents with Ease
          </h1>
          <p className="text-lg text-gray-300 mb-6">
            Keep your government documents safe, accessible, and shareable 
            with the highest security standards.
          </p>
          <Link
            to="/Signup"
            className="bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-yellow-600 transition"
          >
            Get Started
          </Link>
        </div>

        {/* Image */}
        <div className="md:w-1/2 flex justify-center">
        <img
          src={coverImage}
          alt="Secure Document Storage"
          className="w-96 md:w-[28rem] object-contain rounded-lg shadow-lg transition-transform duration-300 scale-105"
          style={{
            WebkitMaskImage: "radial-gradient(circle, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)",
            maskImage: "radial-gradient(circle, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)"
          }}
        />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-800 text-center">
        <h2 className="text-3xl font-bold text-yellow-400 mb-6">Why Choose Us?</h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard title="Secure Storage" text="Your documents are encrypted and stored safely in the cloud." />
          <FeatureCard title="Easy Sharing" text="Share documents securely with family members in just one click." />
          <FeatureCard title="Access Anytime" text="Access your files from anywhere, anytime with full control." />
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 text-center">
        <h2 className="text-3xl font-bold text-yellow-400 mb-6">How It Works</h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <StepCard step="1" title="Sign Up" text="Create a free account to get started." />
          <StepCard step="2" title="Upload Documents" text="Securely store your important documents in one place." />
          <StepCard step="3" title="Share Securely" text="Easily share documents with trusted family members." />
        </div>
      </div>

      {/* Testimonials / Trust Section */}
      <div className="py-16 bg-gray-800 text-center">
        <h2 className="text-3xl font-bold text-yellow-400 mb-6">Trusted by Many</h2>
        <p className="text-gray-300 max-w-3xl mx-auto">
          "This platform has made document sharing so much easier! I can now
          securely store and access my government documents whenever I need."
        </p>
        <p className="text-yellow-400 font-semibold mt-4">- Suriya Madhu Balan</p>
      </div>

      {/* Footer */}
      <footer className="py-6 bg-gray-900 text-center text-gray-400 text-sm">
        <p>&copy; 2025 SecureDocs. All Rights Reserved.</p>
        <div className="mt-2">
          <Link to="/privacy" className="hover:text-yellow-400">Privacy Policy</Link> |
          <Link to="/terms" className="ml-2 hover:text-yellow-400">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
}

// Reusable Feature Card Component
const FeatureCard = ({ title, text }) => (
  <div className="p-6 bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition">
    <h3 className="text-xl font-semibold text-yellow-400 mb-2">{title}</h3>
    <p className="text-gray-300 text-sm">{text}</p>
  </div>
);

// Reusable Step Card Component
const StepCard = ({ step, title, text }) => (
  <div className="p-6 bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition">
    <div className="text-4xl font-extrabold text-yellow-400">{step}</div>
    <h3 className="text-xl font-semibold text-yellow-400 mb-2">{title}</h3>
    <p className="text-gray-300 text-sm">{text}</p>
  </div>
);
