// backend/src/utils/generateToken.js
import jwt from 'jsonwebtoken';

// console.log('DEBUG in generateToken.js - process.env.JWT_SECRET (is it defined?):', process.env.JWT_SECRET ? 'Defined' : 'UNDEFINED!'); // You can remove/keep this
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d';

if (!JWT_SECRET) {
  console.error('--------------------------------------------------------------------');
  console.error('🚫 FATAL ERROR in generateToken.js: JWT_SECRET is not defined.');
  console.error('This should have been caught in index.js. Indicates an unexpected issue.');
  console.error('--------------------------------------------------------------------');
  process.exit(1); // Exit if, for some reason, it's still not defined here
}

const generateToken = (userId, isAdmin = false) => {
  return jwt.sign(
    {
      id: userId,
      isAdmin: isAdmin,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    }
  );
};

export default generateToken;
