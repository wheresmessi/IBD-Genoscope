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
    <div>
      <header className="header">IBD Genoscope</header>

      <div className="main-container">
        <div className="login-page">
          <div className="title-section">
            <div className="title-content">
              <h1>GENETIC RISK DATABASE FOR INFLAMMATORY BOWEL DISEASE</h1>
            </div>
          </div>

          <div className="login-form-section">
            <div className="login-form">
              <h2>Login to Your Account</h2>
              
              {error && <p className="error-text">{error}</p>}

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

              <button className="btn btn-primary" onClick={handleLogin}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <LogIn size={18} />
                  Sign In
                </span>
              </button>

              <button className="btn btn-google">
                <img 
                  src="https://www.google.com/favicon.ico" 
                  alt="Google" 
                  style={{ width: '1.25rem', height: '1.25rem' }}
                />
                Sign in with Google
              </button>

              <p className="signup-link">
                New user? <a href="/signup">Sign Up</a>
              </p>
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