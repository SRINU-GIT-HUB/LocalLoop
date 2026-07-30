import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ListingCard = ({ listing }) => {
  const { user } = useContext(AuthContext);

  // Backend returns camelCase (ListingResponse DTO)
const {
  id,
  title,
  price,
  imageUrl,
  image_url,
  description,
  fullName,
  reputationScore,
  userId,
  status,
  createdAt,
} = listing;  

const displayImage = imageUrl || image_url;
const isOwn = user?.id === userId;
console.log("Seller ID:", listing.userId);
console.log("Seller ID snake:", listing.user_id);
console.log(listing);

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    : '';

  return (
    <div className="listing-card">
      <div className="listing-img-wrap">
        {displayImage ? (
          <img
  src={displayImage}
  alt={title}
  className="listing-img"
  onLoad={() => console.log("IMAGE LOADED")}
  onError={(e) => {
    console.log("IMAGE FAILED");
    console.log(displayImage);

    e.target.src = "https://picsum.photos/400/300";
  }}  
/>
        ) : (
          <div className="listing-img-placeholder">
            <span>📦</span>
            <small>No image</small>
          </div>
        )}
        <span className={`status-pill status-pill--${status || 'active'}`}>
          {status || 'active'}
        </span>
      </div>

      <div className="listing-body">
        <h3 className="listing-title">{title}</h3>
        <p className="listing-price">₹{Number(price).toLocaleString('en-IN')}</p>

        <p className="listing-desc">
          {description?.length > 80 ? description.substring(0, 80) + '…' : description}
        </p>

        <div className="listing-footer">
          <div className="listing-seller">
            <span className="seller-avatar">{fullName?.charAt(0).toUpperCase()}</span>
            <div className="seller-info">
              <span className="seller-name">{fullName}</span>
              <span className="trust-score">⭐ {reputationScore ?? 100}</span>
            </div>
          </div>
          {formattedDate && <span className="listing-date">{formattedDate}</span>}
        </div>

        {!isOwn && (
          // Use user ID so ChatSystem can resolve email without exposing it in the URL
          <Link to={`/inbox?user=${userId}`} className="btn btn--primary btn--full">
            Message Seller
          </Link>
        )}
        {isOwn && (
          <span className="own-badge">Your listing</span>
        )}
      </div>
    </div>
  );
};

export default ListingCard;
