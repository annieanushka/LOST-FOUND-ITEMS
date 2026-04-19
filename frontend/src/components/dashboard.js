import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SearchBar from './SearchBar';

function Dashboard() {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    category: 'all',
    dateFilter: 'all',
  });
  const [toast, setToast] = useState('');

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const fetchItems = useCallback(async () => {
    try {
      const params = {};

      if (filters.search) params.search = filters.search;
      if (filters.type !== 'all') params.type = filters.type;
      if (filters.category !== 'all') params.category = filters.category;
      if (filters.dateFilter !== 'all') params.dateFilter = filters.dateFilter;

      const res = await axios.get('http://localhost:5001/api/items', { params });
      setItems(res.data.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  }, [filters]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear();
    navigate('/login', { replace: true });
  };

  const showToast = (msg) => {
    setToast(msg);

    setTimeout(() => {
      setToast('');
    }, 3000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;

    try {
      await axios.delete(`http://localhost:5001/api/items/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchItems();
      showToast('Item deleted!');
    } catch (error) {
      showToast(error.response?.data?.message || 'Error deleting item!');
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

  const lostCount = items.filter((item) => item.type === 'lost').length;
  const foundCount = items.filter((item) => item.type === 'found').length;
  const myItemsCount = items.filter((item) => item.reportedBy?._id === user?.id).length;

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
            onClick={() => navigate('/add-item')}
          >
            Report Item
          </button>

          <button
            className="report-btn"
            onClick={() => navigate('/my-posts')}
          >
            My Posts
          </button>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="main">
        <div className="stats-row">
          <div className="stat-card lost-stat">
            <div className="stat-label">
              Lost Items
            </div>

            <div className="stat-num">
              {lostCount}
            </div>
          </div>

          <div className="stat-card found-stat">
            <div className="stat-label">
              Found Items
            </div>

            <div className="stat-num">
              {foundCount}
            </div>
          </div>

          <div className="stat-card total-stat">
            <div className="stat-label">
              Total
            </div>

            <div className="stat-num">
              {items.length}
            </div>
          </div>

          <div className="stat-card total-stat">
            <div className="stat-label">
              My Posts
            </div>

            <div className="stat-num">
              {myItemsCount}
            </div>
          </div>
        </div>

        <SearchBar
          filters={filters}
          setFilters={setFilters}
        />

        <div className="items-grid">
          {items.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                No Items
              </div>

              <p>
                No items found. Try adjusting filters or report a new item.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item._id}
                className={`item-card ${item.type}-card`}
              >
                {item.reportedBy?._id === user?.id && (
                  <div className="item-owner-tag">
                    Your post
                  </div>
                )}

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
                    <span>Reported by: {item.reportedBy?.name || 'Unknown'}</span>
                  </div>
                </div>

                <div className="item-footer">
                  <span className="contact-num">
                    Contact: {item.contactNumber}
                  </span>

                  {item.reportedBy?._id === user?.id && (
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  )}
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

export default Dashboard;
