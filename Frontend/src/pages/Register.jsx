import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [communities, setCommunities] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: '', email: '', password: '',
    joinCommunityId: '',
    communityName: '', city: '', state: '', pincode: '',
  });

  useEffect(() => {
    api.get('/communities')
      .then(res => setCommunities(Array.isArray(res.data) ? res.data : []))
      .catch(() => setCommunities([]));
  }, []);

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const validate = () => {
    // Allow the first ADMIN account to register without a community
    const isAdminEmail = form.email === "srinu1845@gmail.com";

    if (!isAdminEmail) {
      if (isCreating) {
        if (!form.communityName.trim())
          return 'Community name is required.';
        if (!form.city.trim())
          return 'City is required.';
      } else {
        if (!form.joinCommunityId)
          return 'Please select a community to join.';
      }
    } 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setError('');
    setIsLoading(true);

    const payload = {
      fullName: form.fullName,
      email: form.email,
      password: form.password,
      isCreatingCommunity: isCreating,
      joinCommunityId:
  form.email === "srinu1845@gmail.com"
    ? null
    : (isCreating ? null : Number(form.joinCommunityId)),
      communityName: isCreating ? form.communityName : null,
      city: isCreating ? form.city : null,
      state: isCreating ? form.state : null,
      pincode: isCreating ? form.pincode : null,
    };

    try {
      const res = await api.post('/auth/register', payload);
      // Correctly update AuthContext so user is logged in immediately
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        'Registration failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card--wide">
        <div className="auth-logo">🔗</div>
        <h2 className="auth-title">Join LocalLoop</h2>
        <p className="auth-subtitle">Create an account to join or start a community</p>

        {error && (
          <div className="alert alert--error" role="alert">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* Basic info */}
          <div className="field">
            <label className="field__label" htmlFor="fullName">Full name</label>
            <input
              id="fullName" name="fullName" type="text"
              className="field__input" placeholder="Your full name"
              value={form.fullName} onChange={handleChange} required
            />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="email">Email address</label>
            <input
              id="email" name="email" type="email"
              className="field__input" placeholder="you@example.com"
              value={form.email} onChange={handleChange} required
            />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="password">Password</label>
            <input
              id="password" name="password" type="password"
              className="field__input" placeholder="At least 6 characters"
              value={form.password} onChange={handleChange} minLength={6} required
            />
          </div>

          {/* Community mode toggle */}
          <div className="toggle-group">
            <button
              type="button"
              className={`toggle-btn ${!isCreating ? 'toggle-btn--active' : ''}`}
              onClick={() => setIsCreating(false)}
            >
              Join a community
            </button>
            <button
              type="button"
              className={`toggle-btn ${isCreating ? 'toggle-btn--active' : ''}`}
              onClick={() => setIsCreating(true)}
            >
              Create a community
            </button>
          </div>

          {/* Join existing */}
          {!isCreating && (
            <div className="field">
              <label className="field__label" htmlFor="joinCommunityId">Select community</label>
              <select
                id="joinCommunityId" name="joinCommunityId"
                className="field__select"
                value={form.joinCommunityId} onChange={handleChange} required
              >
                <option value="">— Choose your community —</option>
                {communities.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.city}{c.state ? `, ${c.state}` : ''})
                  </option>
                ))}
              </select>
              {communities.length === 0 && (
                <p className="field__hint">
                  No communities yet.{' '}
                  <button type="button" className="text-link" onClick={() => setIsCreating(true)}>
                    Create the first one
                  </button>
                </p>
              )}
            </div>
          )}

          {/* Create new */}
          {isCreating && (
            <div className="info-box info-box--green">
              <p className="info-box__title">🏘️ You'll become the Community Leader</p>
              <p className="info-box__desc">
                As a leader you can approve service providers and manage your community.
              </p>
              <div className="field">
                <label className="field__label" htmlFor="communityName">Community name</label>
                <input
                  id="communityName" name="communityName" type="text"
                  className="field__input" placeholder="e.g. Sunshine Nagar RWA"
                  value={form.communityName} onChange={handleChange} required={isCreating}
                />
              </div>
              <div className="field-row">
                <div className="field">
                  <label className="field__label" htmlFor="city">City</label>
                  <input id="city" name="city" type="text" className="field__input" placeholder="City"
                    value={form.city} onChange={handleChange} required={isCreating} />
                </div>
                <div className="field">
                  <label className="field__label" htmlFor="state">State</label>
                  <input id="state" name="state" type="text" className="field__input" placeholder="State"
                    value={form.state} onChange={handleChange} />
                </div>
              </div>
              <div className="field">
                <label className="field__label" htmlFor="pincode">Pincode</label>
                <input id="pincode" name="pincode" type="text" className="field__input" placeholder="110001"
                  value={form.pincode} onChange={handleChange} />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn btn--primary btn--full btn--lg"
            disabled={isLoading}
          >
            {isLoading ? <span className="btn-spinner" /> : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login" className="text-link">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
