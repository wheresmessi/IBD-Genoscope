import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // In a real app, you would validate credentials here
    navigate('/ibd-genoscope');
  };

  return (
    <div>
      <header className="header">
        IBD Genoscope
      </header>
      
      <div className="main-container">
        <div className="login-page">
          {/* Left panel with title */}
          <div className="title-section">
            <div className="title-content">
              <h1>GENETIC RISK DATABASE FOR INFLAMMATORY BOWEL DISEASE</h1>
            </div>
          </div>
          
          {/* Right panel with login form */}
          <div className="login-form-section">
            <div className="login-form">
              <h2>Login to Your Account</h2>
              
              <div className="form-group">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Username or Email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <input 
                  type="password" 
                  className="form-control" 
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              <button 
                className="btn btn-primary" 
                onClick={handleLogin}
              >
                Sign In
              </button>
              
              <button className="btn btn-google">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="#EA4335">
                  <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1.086-9.8l4.046-2.334-4.046-2.334v4.668z"></path>
                </svg>
                Sign in with Google
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="footer">
        K. Lathika | Email: korrapatilathika@gmail.com
      </footer>
    </div>
  );
};

export default Home;