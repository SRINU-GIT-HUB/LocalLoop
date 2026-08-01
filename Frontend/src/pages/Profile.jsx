import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from '../components/Toast';

const CATEGORIES = ['Plumbing', 'Electrical', 'Tutoring', 'Home Repair', 'Cleaning', 'Carpentry', 'Painting', 'IT Support'];

const Profile = () => {
  const { user, refreshUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('listings');

  // Provider application
  const [applying, setApplying] = useState(false);
  const [providerForm, setProviderForm] = useState({
    category: 'Plumbing', description: '', experience: '',
  });

  // Profile edit
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: user?.fullName || '',
    phoneNumber: user?.phoneNumber || '',
    location: user?.location || '',
  });

  useEffect(() => {
    api.get('/listings/my-listings')
      .then(res => setMyListings(Array.isArray(res.data) ? res.data : []))
      .catch(() => toast.error('Failed to load your listings.'))
      .finally(() => setLoading(false));
  }, []);

  const handleDeleteListing = async (id) => {
    if (!window.confirm('Delete this listing? This cannot be undone.')) return;
    try {
      await api.delete(`/listings/${id}`);
      setMyListings(prev => prev.filter(l => l.id !== id));
      toast.success('Listing deleted.');
    } catch {
      toast.error('Failed to delete listing.');
    }
  };

  const handleProviderSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/provider/apply', {
        category: providerForm.category,
        description: providerForm.description,
        experience: providerForm.experience,
      });
      refreshUser({ providerStatus: 'PENDING' });
      setApplying(false);
      toast.success('Application submitted! Awaiting leader approval.');
    } catch {
      toast.error('Failed to submit your application. Please try again.');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/auth/profile', editForm);
      refreshUser(editForm);
      setEditing(false);
      toast.success('Profile updated.');
    } catch {
      toast.error('Failed to update profile.');
    }
  };

  const providerStatusColors = {
    APPROVED: { bg: '#e8f5e9', color: '#2e7d32', label: '✓ Verified Provider' },
    PENDING:  { bg: '#fff3e0', color: '#e65100', label: '⏳ Application Pending' },
    REJECTED: { bg: '#ffebee', color: '#c62828', label: '✕ Application Rejected' },
    NONE:     null,
  };
  const providerBadge = providerStatusColors[user?.providerStatus] || null;

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : null;

  // Calculate profile completion %
  const completionFields = ['fullName', 'email', 'phoneNumber', 'location'];
  const filled = completionFields.filter(f => user?.[f]).length;
  const completionPct = Math.round((filled / completionFields.length) * 100);

  return (
    <div className="page-container">
      <div className="profile-layout">

        {/* Left sidebar */}
        <aside className="profile-sidebar">
          <div className="profile-avatar-lg">
            {user?.fullName?.charAt(0).toUpperCase() || 'U'}
          </div>
          <h2 className="profile-name">{user?.fullName}</h2>
          <p className="profile-email">{user?.email}</p>

          {providerBadge && (
            <span
              className="provider-status-badge"
              style={{ background: providerBadge.bg, color: providerBadge.color }}
            >
              {providerBadge.label}
            </span>
          )}

          <div className="profile-meta">
            {user?.phoneNumber && (
              <div className="meta-row">
                <span>📞</span> {user.phoneNumber}
              </div>
            )}
            {user?.location && (
              <div className="meta-row">
                <span>📍</span> {user.location}
              </div>
            )}
            {joinedDate && (
              <div className="meta-row">
                <span>🗓</span> Joined {joinedDate}
              </div>
            )}
          </div>

          {/* Trust score */}
          <div className="trust-card">
            <div className="trust-score-number">{user?.reputationScore ?? 100}</div>
            <div className="trust-score-label">Trust Score</div>
            <div className="trust-score-bar">
              <div
                className="trust-score-fill"
                style={{ width: `${Math.min((user?.reputationScore ?? 100), 1000) / 10}%` }}
              />
            </div>
          </div>

          {/* Profile completion */}
          <div className="completion-card">
            <div className="completion-header">
              <span>Profile completion</span>
              <span className="completion-pct">{completionPct}%</span>
            </div>
            <div className="completion-bar">
              <div className="completion-fill" style={{ width: `${completionPct}%` }} />
            </div>
          </div>

          <button className="btn btn--outline btn--full" onClick={() => setEditing(true)}>
            ✏️ Edit Profile
          </button>
        </aside>

        {/* Main content */}
        <div className="profile-main">
          {/* Provider status section */}
          {(!user?.providerStatus || user?.providerStatus === 'NONE') && (
            <div className="provider-cta">
              <h3>Become a Service Provider</h3>
              <p>Offer professional services to your local community and build your reputation.</p>
              {!applying ? (
                <button className="btn btn--primary" onClick={() => setApplying(true)}>
                  Apply Now
                </button>
              ) : (
                <form onSubmit={handleProviderSubmit} className="provider-form">
                  <div className="field">
                    <label className="field__label">Service Category</label>
                    <select
                      className="field__select"
                      value={providerForm.category}
                      onChange={e => setProviderForm(p => ({ ...p, category: e.target.value }))}
                    >
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label className="field__label">Years of Experience</label>
                    <input
                      type="number" min="0" max="50" required
                      className="field__input"
                      placeholder="e.g. 3"
                      value={providerForm.experience}
                      onChange={e => setProviderForm(p => ({ ...p, experience: e.target.value }))}
                    />
                  </div>
                  <div className="field">
                    <label className="field__label">Describe your services</label>
                    <textarea
                      rows="3" required
                      className="field__textarea"
                      placeholder="Explain what you offer and your expertise…"
                      value={providerForm.description}
                      onChange={e => setProviderForm(p => ({ ...p, description: e.target.value }))}
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn btn--primary">Submit Application</button>
                    <button type="button" className="btn btn--ghost" onClick={() => setApplying(false)}>Cancel</button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Tabs */}
          <div className="tab-bar">
            <button
              className={`tab-btn ${activeTab === 'listings' ? 'tab-btn--active' : ''}`}
              onClick={() => setActiveTab('listings')}
            >
              My Listings ({myListings.length})
            </button>
          </div>

          {/* Tab: My Listings */}
          {activeTab === 'listings' && (
            <div>
              <div className="tab-header">
                <Link to="/sell" className="btn btn--primary btn--sm">+ New Listing</Link>
              </div>

              {loading ? (
                <div className="skeleton-grid">
                  {[1,2,3].map(i => <div key={i} className="skeleton-card"><div className="skeleton-img"/><div className="skeleton-line"/></div>)}
                </div>
              ) : myListings.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">📦</span>
                  <h3>No listings yet</h3>
                  <p>Start selling items to your community.</p>
                  <Link to="/sell" className="btn btn--primary">Post your first listing</Link>
                </div>
              ) : (
                <div className="my-listings-grid">
                  {myListings.map(item => (
                    <div key={item.id} className="my-listing-card">
                      <div className="my-listing-img-wrap">
                        <img
                          src={item.image_url || 'https://via.placeholder.com/300x160?text=No+Image'}
                          alt={item.title}
                          onError={e => { e.target.src = 'https://via.placeholder.com/300x160?text=No+Image'; }}
                        />
                        <span className={`status-pill status-pill--${item.status}`}>
                          {item.status}
                        </span>
                      </div>
                      <div className="my-listing-body">
                        <h4 className="my-listing-title">{item.title}</h4>
                        <p className="my-listing-price">₹{Number(item.price).toLocaleString('en-IN')}</p>
                        <p className="my-listing-desc">{item.description?.substring(0, 80)}{item.description?.length > 80 ? '…' : ''}</p>
                        <div className="my-listing-actions">
                          <button
                            className="btn btn--ghost btn--sm"
                            onClick={() => handleDeleteListing(item.id)}
                          >
                            🗑 Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editing && (
        <div className="modal-overlay" onClick={() => setEditing(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Profile</h3>
              <button className="modal-close" onClick={() => setEditing(false)}>✕</button>
            </div>
            <form onSubmit={handleEditSubmit} className="auth-form">
              <div className="field">
                <label className="field__label">Full Name</label>
                <input
                  type="text" className="field__input" required
                  value={editForm.fullName}
                  onChange={e => setEditForm(p => ({ ...p, fullName: e.target.value }))}
                />
              </div>
              <div className="field">
                <label className="field__label">Phone Number</label>
                <input
                  type="tel" className="field__input"
                  placeholder="e.g. 9876543210"
                  value={editForm.phoneNumber}
                  onChange={e => setEditForm(p => ({ ...p, phoneNumber: e.target.value }))}
                />
              </div>
              <div className="field">
                <label className="field__label">Location / Area</label>
                <input
                  type="text" className="field__input"
                  placeholder="e.g. Sector 12, Noida"
                  value={editForm.location}
                  onChange={e => setEditForm(p => ({ ...p, location: e.target.value }))}
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn--primary">Save Changes</button>
                <button type="button" className="btn btn--ghost" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
