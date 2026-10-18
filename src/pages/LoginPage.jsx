import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/auth.css';

export const LoginPage = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      // Simulate login - In real app, this would be Firebase/API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Store in localStorage (simple demo)
      localStorage.setItem('user', JSON.stringify({ email, loginTime: new Date() }));
      localStorage.setItem('isAuthenticated', 'true');
      
      onLoginSuccess?.();
      navigate('/wallet');
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">RoyaliX</span>
          </div>
          <p className="auth-subtitle">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span> Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <div className="wallet-options">
          <p className="options-label">Skip email and connect directly:</p>
          <Link to="/wallet" className="btn-wallet">
            <span className="wallet-icon">🔗</span>
            Connect Wallet
          </Link>
        </div>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/signup" className="link">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      <div className="auth-side">
        <div className="side-content">
          <h2>Welcome Back</h2>
          <p>
            Access the RoyaliX dashboard to manage your royalty distribution and 
            revenue sharing.
          </p>
          <ul className="feature-list">
            <li>✓ Create royalty records</li>
            <li>✓ Add revenue to pools</li>
            <li>✓ View details</li>
            <li>✓ Distribute earnings</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
