import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="not-found-page">
    <div className="not-found-content">
      <span className="not-found-code">404</span>
      <h2>Page not found</h2>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn btn--primary btn--lg">
        ← Back to Marketplace
      </Link>
    </div>
  </div>
);

export default NotFound;
