import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddItem() {
  const navigate = useNavigate();
  const [type, setType] = useState('lost');
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    category: '',
    location: '',
    date: '',
    contactNumber: '',
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [toast, setToast] = useState('');
  const [contactError, setContactError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'contactNumber') {
      if (/[^0-9]/.test(value)) {
        setContactError('Invalid number. Only digits are allowed.');
      } else if (value.length > 0 && value.length < 9) {
        setContactError('Contact number must be 9 numbers.');
      } else {
        setContactError('');
      }

      const numericValue = value.replace(/\D/g, '').slice(0, 9);

      setFormData({
        ...formData,
        [name]: numericValue,
      });

      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const showToast = (msg) => {
    setToast(msg);

    setTimeout(() => {
      setToast('');
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    if (!token) {
      showToast('Please login again to report an item.');
      return;
    }

    if (!/^\d{9}$/.test(formData.contactNumber)) {
      setContactError('Contact number must be 9 numbers.');
      showToast('Contact number must be 9 numbers.');
      return;
    }

    try {
      const data = new FormData();

      data.append('type', type);
      data.append('itemName', formData.itemName);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('location', formData.location);
      data.append('date', formData.date);
      data.append('contactNumber', formData.contactNumber);

      if (image) {
        data.append('image', image);
      }

      await axios.post('http://localhost:5001/api/items', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFormData({
        itemName: '',
        description: '',
        category: '',
        location: '',
        date: '',
        contactNumber: '',
      });
      setImage(null);
      setPreview(null);
      setType('lost');
      setContactError('');

      showToast('Item reported successfully!');

      setTimeout(() => {
        navigate('/dashboard');
      }, 800);
    } catch (error) {
      console.error(error);
      showToast(error.response?.data?.message || 'Error! Try again.');
    }
  };

  return (
    <div className="page-container">
      <div className="page-title">
        Report an Item
      </div>

      <div className="page-sub">
        Fill in the details to report a lost or found item.
      </div>

      <div className="form-card">
        <div className="type-toggle">
          <button
            className={`type-btn lost ${type === 'lost' ? 'active' : ''}`}
            onClick={() => setType('lost')}
            type="button"
          >
            Lost Item
          </button>

          <button
            className={`type-btn found ${type === 'found' ? 'active' : ''}`}
            onClick={() => setType('found')}
            type="button"
          >
            Found Item
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div>
              <label>Item Name</label>

              <input
                type="text"
                name="itemName"
                placeholder="e.g. Black Wallet"
                value={formData.itemName}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Category</label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select Category
                </option>

                <option>Electronics</option>
                <option>Wallet</option>
                <option>Bags</option>
                <option>Books</option>
                <option>ID Cards</option>
                <option>Keys</option>
                <option>Clothing</option>
                <option>Other</option>
              </select>
            </div>

            <div className="full">
              <label>Description</label>

              <textarea
                name="description"
                placeholder="Describe the item in detail..."
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>
                {type === 'lost' ? 'Location Lost' : 'Location Found'}
              </label>

              <input
                type="text"
                name="location"
                placeholder="e.g. Near Library"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>
                {type === 'lost' ? 'Date Lost' : 'Date Found'}
              </label>

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Contact Number</label>

              <input
                type="tel"
                name="contactNumber"
                placeholder="e.g. 987654321"
                value={formData.contactNumber}
                onChange={handleChange}
                inputMode="numeric"
                pattern="\d{9}"
                maxLength={9}
                required
              />

              {contactError && (
                <div style={{ color: 'red', marginTop: '6px', fontSize: '14px' }}>
                  {contactError}
                </div>
              )}
            </div>

            <div className="upload-block">
              <label>
                Upload Photo (Optional)
              </label>

              <label className="image-upload-area">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  hidden
                />

                {!preview ? (
                  <>
                    <div className="upload-icon">
                      Upload
                    </div>

                    <p>
                      Click to upload image
                    </p>
                  </>
                ) : (
                  <img
                    src={preview}
                    alt="preview"
                    className="image-preview"
                  />
                )}
              </label>
            </div>
          </div>

          <div className="submit-wrapper">
            <button
              type="submit"
              className="btn-submit"
            >
              {type === 'lost' ? 'Submit Lost Item' : 'Submit Found Item'}
            </button>
          </div>
        </form>
      </div>

      {toast && (
        <div className="toast">
          {toast}
        </div>
      )}
    </div>
  );
}

export default AddItem;
