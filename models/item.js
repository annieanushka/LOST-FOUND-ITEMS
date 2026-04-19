const mongoose = require('mongoose');
const itemSchema = new mongoose.Schema(
  {
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reporting user is required'],
    },
    type: {
      type: String,
      enum: ['lost', 'found'],
      required: [true, 'Please specify lost or found'],
    },
    itemName: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['Electronics', 'Wallet', 'Bags', 'Books', 'ID Cards', 'Keys', 'Clothing', 'Other'],
      required: [true, 'Category is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required'],
      trim: true,
    },
    image: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['open', 'resolved'],
      default: 'open',
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model('Item', itemSchema);
