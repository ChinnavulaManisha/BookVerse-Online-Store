import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [portal, setPortal] = useState('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handlePortalChange = (selectedPortal) => {
    setPortal(selectedPortal);
    if (selectedPortal === 'admin') {
      setEmail('admin@bookverse.com');
      setPassword('admin123');
    } else {
      setEmail('');
      setPassword('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    if (result.success) {
      if (portal === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
    setLoading(false);
  };

  return (
    <div className="auth-page" id="login-page">
      <div className="auth-container">
        <div className="auth-visual">
          <div className="auth-visual-content">
            <div className="auth-books-mockup">
              <div className="mockup-book mockup-book-1">
                <img src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop" alt="Aesthetic Book 1" />
              </div>
              <div className="mockup-book mockup-book-2">
                <img src="https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400&auto=format&fit=crop" alt="Aesthetic Book 2" />
              </div>
            </div>
            <h2>{portal === 'admin' ? 'Admin Access' : 'Welcome Back'}</h2>
          </div>
        </div>
        <div className="auth-form-section">
          <form className="auth-form" onSubmit={handleSubmit} id="login-form">
            <div className="auth-tabs">
              <button
                type="button"
                className={`auth-tab ${portal === 'customer' ? 'active' : ''}`}
                onClick={() => handlePortalChange('customer')}
              >
                Customer Portal
              </button>
              <button
                type="button"
                className={`auth-tab ${portal === 'admin' ? 'active' : ''}`}
                onClick={() => handlePortalChange('admin')}
              >
                Admin Portal
              </button>
            </div>

            <h1>{portal === 'admin' ? 'Admin Portal' : 'Sign In'}</h1>
            <p className="auth-subtitle">
              {portal === 'admin' 
                ? 'Sign in to access your administrative dashboard' 
                : 'Enter your credentials to continue to your account'}
            </p>

            <div className="form-group">
              <label htmlFor="login-email"><FiMail /> Email</label>
              <input type="email" id="login-email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>

            <div className="form-group">
              <label htmlFor="login-password"><FiLock /> Password</label>
              <div className="password-input">
                <input type={showPassword ? 'text' : 'password'} id="login-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required />
                <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading} id="login-submit-btn">
              {loading ? 'Signing in...' : portal === 'admin' ? 'Access Dashboard' : 'Sign In'}
            </button>

            <p className="auth-switch">
              Don't have an account? <Link to="/register">Create Account</Link>
            </p>

            {portal === 'admin' && (
              <div className="demo-credentials">
                <p><strong>Demo Admin:</strong> admin@bookverse.com / admin123</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
