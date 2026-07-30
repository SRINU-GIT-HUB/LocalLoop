import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ServiceCard = ({ service }) => {
  const { user } = useContext(AuthContext);

  const {
    provider_id,
    provider_name,
    provider_title,
    provider_description,
    service_category,
    average_rating,
    total_reviews,
    completed_jobs,
    hourly_rate,
    profile_photo,
    location,
    availability,
  } = service;

  const isOwn = user?.id === provider_id;

  const stars = average_rating
    ? '★'.repeat(Math.round(average_rating)) + '☆'.repeat(5 - Math.round(average_rating))
    : null;

  return (
    <div className="service-card">
      <div className="service-card__header">
        <div className="service-avatar">
          {profile_photo ? (
            <img
              src={profile_photo}
              alt={provider_name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <span style={{ display: profile_photo ? 'none' : 'flex' }}>
            {provider_name?.charAt(0).toUpperCase() || 'P'}
          </span>
        </div>

        <div className="service-provider-meta">
          <h3 className="provider-name">{provider_name}</h3>
          <p className="provider-title">{provider_title || 'Professional'}</p>
          {availability && (
            <span className={`avail-badge avail-badge--${availability === 'Available' ? 'yes' : 'no'}`}>
              {availability}
            </span>
          )}
        </div>
      </div>

      <div className="service-card__body">
        <span className="category-tag">{service_category}</span>

        <p className="service-desc">
          {provider_description?.length > 100
            ? provider_description.substring(0, 100) + '…'
            : provider_description || 'No description provided.'}
        </p>

        {location && (
          <p className="service-location">📍 {location}</p>
        )}
      </div>

      <div className="service-card__stats">
        <div className="stat-item">
          <span className="stat-label">Rating</span>
          <span className="stat-val">
            {average_rating ? (
              <>
                <span className="stars">{stars}</span>
                <small>({total_reviews})</small>
              </>
            ) : (
              <span className="stat-new">New</span>
            )}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Jobs</span>
          <span className="stat-val">{completed_jobs ?? 0}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Rate</span>
          <span className="stat-val">₹{Number(hourly_rate || 0).toLocaleString('en-IN')}/hr</span>
        </div>
      </div>

      {!isOwn && (
        <div className="service-card__actions">
          <Link to={`/inbox?user=${provider_id}`} className="btn btn--primary">
            Message Provider
          </Link>
        </div>
      )}
      {isOwn && (
        <div className="service-card__actions">
          <span className="own-badge">Your service</span>
        </div>
      )}
    </div>
  );
};

export default ServiceCard;
