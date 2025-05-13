import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }
    setError('');
    navigate('/ibd-genoscope');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm py-2 px-6 fixed top-0 w-full z-10">
        <div className="max-w-7xl mx-auto flex justify-center items-center">
          <h2 className="text-3xl font-bold text-blue-600 tracking-wide">
            IBD Genoscope
          </h2>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 mt-16 mb-16">
        <div className="w-full max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden flex min-h-[600px] max-h-[80vh]">
            {/* Left Section */}
            <div className="w-1/2 bg-gradient-to-br from-blue-500 to-blue-700 p-8 text-white flex flex-col justify-center">
              <h2 className="text-2xl font-bold mb-6">GENETIC RISK DATABASE FOR INFLAMMATORY BOWEL DISEASE</h2>
              <p className="text-blue-50">Access comprehensive genetic data and risk analysis tools for IBD research.</p>
            </div>

            {/* Right Section */}
            <div className="w-1/2 p-8 flex flex-col justify-center">
              <div className="w-full max-w-md mx-auto">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Login to Your Account</h2>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <div className="space-y-4">
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                    placeholder="Username or Email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />

                  <input 
                    type="password" 
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    onClick={handleLogin}
                  >
                    <LogIn size={18} />
                    Sign In
                  </button>

                  <p className="text-center text-gray-600">
                    New user? <a href="/signup" className="text-blue-600 hover:underline">Sign Up</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white shadow-sm py-4 px-6 fixed bottom-0 w-full">
        <p className="text-center text-gray-600">
          K. Lathika | Email: korrapatilathika@gmail.com
        </p>
      </footer>
    </div>
  );
};

export default Home;