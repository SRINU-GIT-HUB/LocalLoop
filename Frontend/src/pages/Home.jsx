import { useState, useEffect, useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ListingCard from '../components/ListingCard';
import { AuthContext } from '../context/AuthContext';

const ITEMS_PER_PAGE = 9;

const Home = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    api.get('/listings')
      .then(res => setListings(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError('Failed to load the marketplace. Please try again.'))
      .finally(() => setLoading(false));
  }, [user]);

  // Reset page when search changes
  useEffect(() => { setPage(1); }, [search, sortBy]);

  const filtered = useMemo(() => {
    let list = [...listings];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        l => l.title?.toLowerCase().includes(q) || l.description?.toLowerCase().includes(q)
      );
    }
    if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'price-asc') {
      list.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => Number(b.price) - Number(a.price));
    }
    return list;
  }, [listings, search, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // --- Guest landing ---
  if (!user) {
    return (
      <div className="hero">
        <div className="hero__content">
          <span className="hero__eyebrow">Community Marketplace</span>
          <h1 className="hero__title">
            Buy, sell, and connect<br />
            <span className="hero__accent">within your neighbourhood</span>
          </h1>
          <p className="hero__subtitle">
            LocalLoop is a trust-first marketplace where your reputation matters.
            Every transaction stays within your verified community.
          </p>
          <div className="hero__actions">
            <Link to="/register" className="btn btn--primary btn--lg">
              Join your community
            </Link>
            <Link to="/login" className="btn btn--outline btn--lg">
              Log in
            </Link>
          </div>
        </div>
        <div className="hero__features">
          {[
            { icon: '🏘️', title: 'Community-first', desc: 'Only see listings from your verified neighbours.' },
            { icon: '⭐', title: 'Trust scores', desc: 'Reputation earned through real transactions.' },
            { icon: '🔒', title: 'Private & secure', desc: 'JWT-secured accounts and data privacy.' },
          ].map(f => (
            <div key={f.title} className="feature-card">
              <span className="feature-icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Page header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Marketplace</h1>
          <p className="page-subtitle">Items listed by your community members</p>
        </div>
        <Link to="/sell" className="btn btn--primary">
          + New Listing
        </Link>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search listings…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch('')}>✕</button>
          )}
        </div>

        <select
          className="sort-select"
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
        >
          <option value="newest">Newest first</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
      </div>

      {/* Results */}
      {loading ? (
        <div className="skeleton-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-img" />
              <div className="skeleton-line" />
              <div className="skeleton-line skeleton-line--short" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="error-state">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
          <button className="btn btn--outline" onClick={() => window.location.reload()}>
            Try again
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          {search ? (
            <>
              <span className="empty-icon">🔍</span>
              <h3>No results for "{search}"</h3>
              <p>Try a different keyword or <button className="text-link" onClick={() => setSearch('')}>clear the search</button>.</p>
            </>
          ) : (
            <>
              <span className="empty-icon">📦</span>
              <h3>No listings yet</h3>
              <p>Be the first to list something for your community!</p>
              <Link to="/sell" className="btn btn--primary">Post a listing</Link>
            </>
          )}
        </div>
      ) : (
        <>
          <p className="results-count">
            {filtered.length} {filtered.length === 1 ? 'listing' : 'listings'}
            {search && ` for "${search}"`}
          </p>
          <div className="listings-grid">
            {paginated.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn btn--ghost btn--sm"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  className={`pagination-btn ${p === page ? 'pagination-btn--active' : ''}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
              <button
                className="btn btn--ghost btn--sm"
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
