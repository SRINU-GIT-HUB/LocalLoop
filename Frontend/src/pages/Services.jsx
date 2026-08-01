import { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import ServiceCard from '../components/ServiceCard';

const CATEGORIES = ['All', 'Plumbing', 'Electrical', 'Tutoring', 'Home Repair', 'Cleaning', 'Carpentry', 'Painting', 'IT Support', 'Laptop Repair'];

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    api.get('/services')
      .then(res => setServices(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError('Failed to load services. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = [...services];
    if (category !== 'All') {
      list = list.filter(s => s.service_category === category);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        s =>
          s.provider_name?.toLowerCase().includes(q) ||
          s.provider_description?.toLowerCase().includes(q) ||
          s.service_category?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [services, search, category]);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Local Services</h1>
          <p className="page-subtitle">Find trusted professionals in your community</p>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search providers…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch('')}>✕</button>
          )}
        </div>

        <select
          className="sort-select"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="skeleton-grid">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-img" />
              <div className="skeleton-line" />
              <div className="skeleton-line skeleton-line--short" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="error-state">
          <span>⚠️</span>
          <p>{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🛠️</span>
          <h3>No services found</h3>
          {search || category !== 'All' ? (
            <p>Try clearing your filters.</p>
          ) : (
            <p>No approved service providers yet. Apply from your profile!</p>
          )}
        </div>
      ) : (
        <>
          <p className="results-count">
            {filtered.length} {filtered.length === 1 ? 'provider' : 'providers'} available
          </p>
          <div className="services-grid">
            {filtered.map(s => (
              <ServiceCard key={s.provider_id} service={s} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Services;
