import { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import { toast } from '../components/Toast';

const TABS = ['overview', 'users', 'communities', 'listings'];

const AdminPortal = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ totalUsers: 0, totalCommunities: 0, totalListings: 0, pendingProviders: 0 });
  const [users, setUsers] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch Stats on Load
  useEffect(() => {
    adminService.getDashboardStats()
      .then(data => setStats(data))
      .catch(() => setError('Failed to load dashboard data.'))
      .finally(() => setLoading(false));
  }, []);

  // Fetch Tab Data
  useEffect(() => {
    if (activeTab === 'users' && users.length === 0) {
      adminService.getAllUsers()
        .then(data => setUsers(Array.isArray(data) ? data : []))
        .catch(() => toast.error('Failed to load users.'));
    }
    if (activeTab === 'communities' && communities.length === 0) {
      adminService.getAllCommunities()
        .then(data => setCommunities(Array.isArray(data) ? data : []))
        .catch(() => toast.error('Failed to load communities.'));
    }
    if (activeTab === 'listings' && listings.length === 0) {
      adminService.getAllListings()
        .then(data => setListings(Array.isArray(data) ? data : []))
        .catch(() => toast.error('Failed to load listings.'));
    }
  }, [activeTab]);

  // ==========================================
  // ACTION HANDLERS
  // ==========================================

  // User Actions
  const handleRoleChange = async (id, newRole) => {
    try {
      await adminService.updateUser(id, { role: newRole });
      setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
      toast.success("User role updated");
    } catch (err) {
      toast.error("Failed to update role");
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Permanently delete this user? This cannot be undone.")) {
      try {
        await adminService.deleteUser(id);
        setUsers(users.filter(u => u.id !== id));
        toast.success("User deleted");
      } catch (err) {
        toast.error("Failed to delete user");
      }
    }
  };

  // Community Actions
  const handleDeleteCommunity = async (id) => {
    if (window.confirm("Delete this community and all its users?")) {
      try {
        await adminService.deleteCommunity(id);
        setCommunities(communities.filter(c => c.id !== id));
        toast.success("Community deleted");
      } catch (err) {
        toast.error("Failed to delete community");
      }
    }
  };

  // Listing Actions
  const handleListingStatusChange = async (id, newStatus) => {
    try {
      await adminService.updateListingAsAdmin(id, { status: newStatus });
      setListings(listings.map(l => l.id === id ? { ...l, status: newStatus } : l));
      toast.success("Listing status updated");
    } catch (err) {
      toast.error("Failed to update listing");
    }
  };

  const handleDeleteListing = async (id) => {
    if (window.confirm("Delete this listing as admin?")) {
      try {
        await adminService.deleteListingAsAdmin(id);
        setListings(listings.filter(l => l.id !== id));
        toast.success("Listing deleted");
      } catch (err) {
        toast.error("Failed to delete listing");
      }
    }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (error) return (
    <div className="page-container">
      <div className="alert alert--error"><span>⚠️</span> {error}</div>
    </div>
  );

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: '👥', color: 'blue' },
    { title: 'Communities', value: stats.totalCommunities, icon: '🏘️', color: 'green' },
    { title: 'Active Listings', value: stats.activeListings || stats.totalListings, icon: '📦', color: 'amber' },
    { title: 'Pending Providers', value: stats.pendingProviders, icon: '⏳', color: stats.pendingProviders > 0 ? 'red' : 'gray' },
  ];

  const roleBadgeColor = {
    ADMIN: '#7c3aed',
    LEADER: '#d97706',
    SERVICE_PROVIDER: '#0891b2',
    USER: '#64748b',
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Platform management and oversight</p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="tab-bar tab-bar--admin">
        {TABS.map(t => (
          <button
            key={t}
            className={`tab-btn ${activeTab === t ? 'tab-btn--active' : ''}`}
            onClick={() => setActiveTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div>
          <div className="stats-grid stats-grid--4">
            {statCards.map(c => (
              <div key={c.title} className={`stat-card stat-card--${c.color}`}>
                <div className="stat-card__icon">{c.icon}</div>
                <div className="stat-card__content">
                  <p className="stat-card__label">{c.title}</p>
                  <h3 className="stat-card__value">{c.value}</h3>
                </div>
              </div>
            ))}
          </div>

          <div className="admin-grid">
            <div className="section-card">
              <div className="section-card__header">
                <h3>Platform Health</h3>
              </div>
              <div className="health-check-list">
                <div className="health-item health-item--ok">
                  <span>✓</span> Authentication system active
                </div>
                <div className="health-item health-item--ok">
                  <span>✓</span> Community isolation enforced
                </div>
                <div className={`health-item ${stats.pendingProviders > 0 ? 'health-item--warn' : 'health-item--ok'}`}>
                  {stats.pendingProviders > 0
                    ? `⚠ ${stats.pendingProviders} provider application(s) awaiting leader review`
                    : '✓ All provider applications reviewed'}
                </div>
              </div>
            </div>

            <div className="section-card">
              <div className="section-card__header">
                <h3>Quick Actions</h3>
              </div>
              <div className="quick-actions">
                <button className="btn btn--outline" onClick={() => setActiveTab('users')}>Manage Users</button>
                <button className="btn btn--outline" onClick={() => setActiveTab('communities')}>Manage Communities</button>
                <button className="btn btn--outline" onClick={() => setActiveTab('listings')}>Manage Listings</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab with Edit/Delete */}
      {activeTab === 'users' && (
        <div className="section-card">
          <div className="section-card__header">
            <h3>All Users ({users.length})</h3>
          </div>
          {users.length === 0 ? (
            <div className="loading-screen"><div className="spinner" /></div>
          ) : (
            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Trust Score</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>
                        <div className="table-user">
                          <span className="table-avatar">{u.fullName?.charAt(0)}</span>
                          {u.fullName}
                        </div>
                      </td>
                      <td className="table-email">{u.email}</td>
                      <td>
                        <select 
                          className="field__select" 
                          style={{ padding: '0.3rem', width: 'auto', fontSize: '0.8rem', borderColor: roleBadgeColor[u.role] }}
                          value={u.role || 'USER'}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        >
                          <option value="USER">User</option>
                          <option value="SERVICE_PROVIDER">Provider</option>
                          <option value="LEADER">Leader</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </td>
                      <td>
                        <span className="trust-number">{u.reputationScore ?? 100}</span>
                      </td>
                      <td>
                        <button onClick={() => handleDeleteUser(u.id)} className="btn btn--danger btn--sm">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Communities Tab with Delete */}
      {activeTab === 'communities' && (
        <div className="section-card">
          <div className="section-card__header">
            <h3>All Communities ({communities.length})</h3>
          </div>
          {communities.length === 0 ? (
            <div className="loading-screen"><div className="spinner" /></div>
          ) : (
            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Community Name</th>
                    <th>Location</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {communities.map(c => (
                    <tr key={c.id}>
                      <td className="table-title">🏘️ {c.name}</td>
                      <td>{[c.city, c.state, c.pincode].filter(Boolean).join(', ')}</td>
                      <td className="table-date">
                        {c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : ''}
                      </td>
                      <td>
                        <button onClick={() => handleDeleteCommunity(c.id)} className="btn btn--danger btn--sm">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Listings Tab with Edit/Delete */}
      {activeTab === 'listings' && (
        <div className="section-card">
          <div className="section-card__header">
            <h3>All Listings ({listings.length})</h3>
          </div>
          {listings.length === 0 ? (
            <div className="loading-screen"><div className="spinner" /></div>
          ) : (
            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Seller</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map(l => (
                    <tr key={l.id}>
                      <td className="table-title">{l.title}</td>
                      <td>₹{Number(l.price).toLocaleString('en-IN')}</td>
                      <td>{l.fullName}</td>
                      <td>
                        <select 
                          className="field__select" 
                          style={{ padding: '0.3rem', width: 'auto', fontSize: '0.8rem' }}
                          value={l.status || 'active'}
                          onChange={(e) => handleListingStatusChange(l.id, e.target.value)}
                        >
                          <option value="active">Active</option>
                          <option value="hidden">Hidden (Moderated)</option>
                          <option value="sold">Sold</option>
                        </select>
                      </td>
                      <td>
                        <button onClick={() => handleDeleteListing(l.id)} className="btn btn--danger btn--sm">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPortal;