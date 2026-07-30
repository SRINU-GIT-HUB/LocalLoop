import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await api.post('/api/auth/login', { email, password });
      login(response.data.user, response.data.token);
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        (err.response?.status === 401 ? 'Incorrect email or password.' : 'Login failed. Please try again.')
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🔗</div>
        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">Log in to your LocalLoop account</p>

        {error && (
          <div className="alert alert--error" role="alert">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="field">
            <label className="field__label" htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              className="field__input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="password">Password</label>
            <div className="field__input-wrap">
              <input
                id="password"
                type={showPwd ? 'text' : 'password'}
                className="field__input field__input--padded-r"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="field__eye"
                onClick={() => setShowPwd(v => !v)}
                tabIndex={-1}
              >
                {showPwd ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn--primary btn--full btn--lg"
            disabled={isLoading}
          >
            {isLoading ? <span className="btn-spinner" /> : 'Log In'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register" className="text-link">Sign up here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
