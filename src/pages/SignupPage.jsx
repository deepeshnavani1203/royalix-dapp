import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/auth.css';

export const SignupPage = ({ onSignupSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Simulate signup
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Store in localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.some(u => u.email === formData.email)) {
        setError('Email already registered');
        setLoading(false);
        return;
      }

      users.push({
        fullName: formData.fullName,
        email: formData.email,
        createdAt: new Date(),
      });

      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('user', JSON.stringify({ 
        email: formData.email, 
        fullName: formData.fullName,
        loginTime: new Date() 
      }));
      localStorage.setItem('isAuthenticated', 'true');
      
      onSignupSuccess?.();
      navigate('/wallet');
    } catch {
      setError('Signup failed. Please try again.');
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
          <p className="auth-subtitle">Create your account</p>
        </div>

        <form onSubmit={handleSignup} className="auth-form">
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              name="fullName"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span> Creating Account...
              </>
            ) : (
              'Create Account'
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
            Already have an account?{' '}
            <Link to="/login" className="link">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <div className="auth-side">
        <div className="side-content">
          <h2>Get Started Today</h2>
          <p>
            Join creators and platforms using RoyaliX to manage decentralized 
            royalty distribution.
          </p>
          <ul className="feature-list">
            <li>✓ Secure account setup</li>
            <li>✓ Connect your wallet</li>
            <li>✓ Start managing royalties</li>
            <li>✓ Full transparency</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
