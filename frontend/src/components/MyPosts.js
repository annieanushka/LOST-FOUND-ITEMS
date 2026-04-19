import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function MyPosts() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [toast, setToast] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast('');
    }, 3000);
  };

  const fetchMyPosts = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/items/mine/list', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setItems(res.data.data);
    } catch (error) {
      showToast(error.response?.data?.message || 'Could not load your posts.');
    }
  }, [token]);

  useEffect(() => {
    fetchMyPosts();
  }, [fetchMyPosts]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;

    try {
      await axios.delete(`http://localhost:5001/api/items/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setItems((currentItems) => currentItems.filter((item) => item._id !== id));
      showToast('Item deleted successfully.');
    } catch (error) {
      showToast(error.response?.data?.message || 'Error deleting item.');
    }
  };

  const catIcons = {
    Electronics: 'Phone',
    Wallet: 'Wallet',
    Bags: 'Bag',
    Books: 'Book',
    'ID Cards': 'ID',
    Keys: 'Keys',
    Clothing: 'Clothes',
    Other: 'Item',
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <span className="lost">Lost</span>
          &nbsp;&
          <span className="found">Found</span>
          Portal
        </div>

        <div className="nav-right">
          <span className="welcome-text">
            Hello, {user?.name}
          </span>

          <button
            className="report-btn"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="main">
        <div className="page-title">
          My Posts
        </div>

        <div className="page-sub">
          View and manage the items you have reported.
        </div>

        <div className="stats-row">
          <div className="stat-card total-stat">
            <div className="stat-label">
              Total My Posts
            </div>

            <div className="stat-num">
              {items.length}
            </div>
          </div>
        </div>

        <div className="items-grid">
          {items.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                No Posts
              </div>

              <p>
                You have not posted any items yet.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item._id}
                className={`item-card ${item.type}-card`}
              >
                <div className="item-owner-tag">
                  Your post
                </div>

                <div className="item-img">
                  {item.image ? (
                    <img
                      src={`http://localhost:5001/uploads/${item.image}`}
                      alt={item.itemName}
                    />
                  ) : (
                    <span>
                      {catIcons[item.category] || 'Item'}
                    </span>
                  )}
                </div>

                <div className="item-body">
                  <div className="item-header">
                    <div className="item-name">
                      {item.itemName}
                    </div>

                    <div className={`badge ${item.type}`}>
                      {item.type}
                    </div>
                  </div>

                  <div className="item-desc">
                    {item.description}
                  </div>

                  <div className="item-meta">
                    <span>Category: {item.category}</span>
                    <span>Location: {item.location}</span>
                    <span>Date: {new Date(item.date).toLocaleDateString('en-IN')}</span>
                    <span>Status: {item.status}</span>
                    <span>Contact: {item.contactNumber}</span>
                  </div>
                </div>

                <div className="item-footer">
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {toast && (
        <div className="toast">
          {toast}
        </div>
      )}
    </div>
  );
}

export default MyPosts;
