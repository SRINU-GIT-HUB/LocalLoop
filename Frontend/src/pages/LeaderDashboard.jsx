import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from '../components/Toast';

const LeaderDashboard = () => {
  const { user } = useContext(AuthContext);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(null);

  const fetchPendingRequests = async () => {
    try {
      const res = await api.get('/api/leader/provider-requests/pending');
      setPendingRequests(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError('Failed to load pending requests. Ensure you have Leader access.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPendingRequests(); }, []);

  const handleApprove = async (userId) => {
    setProcessing(userId);
    try {
      await api.put(`/api/leader/provider-requests/${userId}/approve`, {});
      toast.success('Provider approved successfully.');
      fetchPendingRequests();
    } catch {
      toast.error('Failed to approve provider.');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (userId) => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection.');
      return;
    }
    setProcessing(userId);
    try {
      await api.put(
        `/api/leader/provider-requests/${userId}/reject`,
        rejectionReason,
        { headers: { 'Content-Type': 'text/plain' } }
      );
      toast.success('Application rejected.');
      setSelectedUser(null);
      setRejectionReason('');
      fetchPendingRequests();
    } catch {
      toast.error('Failed to reject provider.');
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Leader Dashboard</h1>
          <p className="page-subtitle">Manage your community — {user?.fullName}</p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="stats-grid">
        <div className="stat-card stat-card--blue">
          <div className="stat-card__icon">⏳</div>
          <div className="stat-card__content">
            <p className="stat-card__label">Pending Reviews</p>
            <h3 className="stat-card__value">{pendingRequests.length}</h3>
          </div>
        </div>
        <div className="stat-card stat-card--green">
          <div className="stat-card__icon">👥</div>
          <div className="stat-card__content">
            <p className="stat-card__label">Your Role</p>
            <h3 className="stat-card__value">Community Leader</h3>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert--error">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Provider requests */}
      <div className="section-card">
        <div className="section-card__header">
          <h2>Service Provider Applications</h2>
          <span className="badge badge--warning">{pendingRequests.length} pending</span>
        </div>

        {loading ? (
          <div className="loading-screen"><div className="spinner" /></div>
        ) : pendingRequests.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">✅</span>
            <h3>All caught up!</h3>
            <p>No pending service provider applications in your community.</p>
          </div>
        ) : (
          <div className="request-list">
            {pendingRequests.map(req => (
              <div key={req.id} className="request-card">
                <div className="request-card__user">
                  <div className="request-avatar">
                    {req.fullName?.charAt(0).toUpperCase()}
                  </div>
                  <div className="request-info">
                    <h4>{req.fullName}</h4>
                    <p className="request-email">{req.email}</p>
                    {req.serviceCategory && (
                      <span className="category-tag">{req.serviceCategory}</span>
                    )}
                    {req.providerDescription && (
                      <p className="request-desc">{req.providerDescription}</p>
                    )}
                    {req.experienceYears != null && (
                      <p className="request-exp">Experience: {req.experienceYears} year(s)</p>
                    )}
                  </div>
                </div>

                <div className="request-card__actions">
                  {selectedUser === req.id ? (
                    <div className="reject-form">
                      <input
                        type="text"
                        className="field__input"
                        placeholder="Reason for rejection…"
                        value={rejectionReason}
                        onChange={e => setRejectionReason(e.target.value)}
                      />
                      <div className="reject-form__btns">
                        <button
                          className="btn btn--danger btn--sm"
                          disabled={processing === req.id}
                          onClick={() => handleReject(req.id)}
                        >
                          {processing === req.id ? '…' : 'Confirm Reject'}
                        </button>
                        <button
                          className="btn btn--ghost btn--sm"
                          onClick={() => { setSelectedUser(null); setRejectionReason(''); }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        className="btn btn--primary btn--sm"
                        disabled={processing === req.id}
                        onClick={() => handleApprove(req.id)}
                      >
                        {processing === req.id ? '…' : '✓ Approve'}
                      </button>
                      <button
                        className="btn btn--danger btn--sm"
                        onClick={() => setSelectedUser(req.id)}
                      >
                        ✕ Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderDashboard;
