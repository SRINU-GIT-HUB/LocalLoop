import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from '../components/Toast';

const AddListing = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    image_url: '',
    status: 'active',
  });
  const [preview, setPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === 'image_url') setPreview(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Listing title is required.'); return; }
    if (!form.price || Number(form.price) < 0) { setError('Enter a valid price.'); return; }

    setError('');
    setIsSubmitting(true);
    try {
      await api.post('/api/listings', {
        title: form.title,
        description: form.description,
        price: form.price,
        image_url: form.image_url,
      });
      toast.success('Listing posted successfully!');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container page-container--narrow">
      <div className="page-header">
        <div>
          <Link to="/" className="breadcrumb-link">← Back to Marketplace</Link>
          <h1 className="page-title">Post a Listing</h1>
          <p className="page-subtitle">Sell an item to your community</p>
        </div>
      </div>

      <div className="form-card">
        {error && (
          <div className="alert alert--error">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="listing-form">
          <div className="field">
            <label className="field__label" htmlFor="title">
              Title <span className="required">*</span>
            </label>
            <input
              id="title" name="title" type="text"
              className="field__input"
              placeholder="e.g. Used Calculus Textbook — 8th Edition"
              value={form.title} onChange={handleChange} required
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label className="field__label" htmlFor="price">
                Price (₹) <span className="required">*</span>
              </label>
              <input
                id="price" name="price" type="number"
                className="field__input"
                min="0" step="1"
                placeholder="500"
                value={form.price} onChange={handleChange} required
              />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="status">Status</label>
              <select id="status" name="status" className="field__select"
                value={form.status} onChange={handleChange}>
                <option value="active">Active</option>
                <option value="sold">Mark as Sold</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label className="field__label" htmlFor="description">
              Description <span className="required">*</span>
            </label>
            <textarea
              id="description" name="description" rows="4"
              className="field__textarea"
              placeholder="Describe the condition, age, features, reason for selling…"
              value={form.description} onChange={handleChange} required
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="image_url">Image URL (optional)</label>
            <input
              id="image_url" name="image_url" type="url"
              className="field__input"
              placeholder="https://example.com/photo.jpg"
              value={form.image_url} onChange={handleChange}
            />
            {preview && (
              <div className="img-preview">
                <img
                  src={preview} alt="Preview"
                  onError={() => setPreview('')}
                />
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn--primary btn--lg" disabled={isSubmitting}>
              {isSubmitting ? <span className="btn-spinner" /> : 'Post Listing'}
            </button>
            <Link to="/" className="btn btn--ghost btn--lg">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddListing;
