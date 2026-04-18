const jwt = require('jsonwebtoken');

const JWT_SECRET = 'lostandfound_secret_key';

const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized! Please login first.',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token! Please login again.',
    });
  }
};

module.exports = protect;