import jwt from 'jsonwebtoken';

export const generateToken = (userId) => {
  const expiration = parseInt(process.env.JWT_EXPIRATION) || 86400000; // 24 hours
  const expiresIn = Math.floor(expiration / 1000); // Convert to seconds

  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET_KEY,
    { expiresIn: `${expiresIn}s` }
  );
};

export const generateRefreshToken = (userId) => {
  const expiration = parseInt(process.env.JWT_REFRESH_EXPIRATION) || 604800000; // 7 days
  const expiresIn = Math.floor(expiration / 1000);

  return jwt.sign(
    { id: userId, type: 'refresh' },
    process.env.JWT_SECRET_KEY,
    { expiresIn: `${expiresIn}s` }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    throw error;
  }
};
