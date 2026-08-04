import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return;
    }
    setLoading(true);
    const result = await register(name, email, password);
    if (result.success) {
      navigate('/');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page" id="register-page">
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
            <h2>Join BookVerse</h2>
          </div>
        </div>
        <div className="auth-form-section">
          <form className="auth-form" onSubmit={handleSubmit} id="register-form">
            <h1>Create Account</h1>
            <p className="auth-subtitle">Fill in your details to get started</p>

            <div className="form-group">
              <label htmlFor="reg-name"><FiUser /> Full Name</label>
              <input type="text" id="reg-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required />
            </div>

            <div className="form-group">
              <label htmlFor="reg-email"><FiMail /> Email</label>
              <input type="email" id="reg-email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>

            <div className="form-group">
              <label htmlFor="reg-password"><FiLock /> Password</label>
              <div className="password-input">
                <input type={showPassword ? 'text' : 'password'} id="reg-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" required minLength={6} />
                <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-confirm"><FiLock /> Confirm Password</label>
              <input type="password" id="reg-confirm" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat password" required />
              {confirmPassword && password !== confirmPassword && (
                <span className="form-error">Passwords do not match</span>
              )}
            </div>

            <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading || (confirmPassword && password !== confirmPassword)} id="register-submit-btn">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

            <p className="auth-switch">
              Already have an account? <Link to="/login">Sign In</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
