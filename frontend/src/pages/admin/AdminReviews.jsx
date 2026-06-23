import { useEffect, useState } from 'react';
import { Star, Trash } from 'lucide-react';
import { fetchAdminReviews, deleteAdminReview } from '../../api';
import '../../styles/Panel.css';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetchAdminReviews()
      .then(setReviews)
      .catch(() => alert('Failed to load reviews'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this review?')) return;
    try {
      await deleteAdminReview(id);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <h1>Reviews</h1>
      <p className="panel-subtitle">Moderate customer product reviews</p>

      {loading ? (
        <div className="loading-spinner" style={{ margin: '40px auto' }} />
      ) : reviews.length === 0 ? (
        <div className="empty-state"><p>No reviews yet.</p></div>
      ) : (
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Reviewer</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r._id}>
                  <td data-label="Product">{r.product?.name || '—'}</td>
                  <td data-label="Reviewer">{r.userName}</td>
                  <td data-label="Rating">
                    <span className="status-badge" style={{ background: '#FFD70020', color: '#B8860B' }}>
                      <Star size={11} fill="#FFD700" color="#FFD700" /> {r.rating}
                    </span>
                  </td>
                  <td data-label="Comment">
                    {r.comment ? (r.comment.length > 60 ? `${r.comment.slice(0, 60)}…` : r.comment) : '—'}
                  </td>
                  <td data-label="Date">{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td data-label="Actions">
                    <div className="panel-actions">
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(r._id)}>
                        <Trash size={14} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
