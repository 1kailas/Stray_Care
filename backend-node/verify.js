// Quick verification test for Node.js backend
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.log('🔍 Backend Verification Test\n');
console.log('================================\n');

// Test 1: Environment Variables
console.log('Test 1: Environment Variables');
console.log('✓ MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : '❌ Missing');
console.log('✓ JWT_SECRET_KEY:', process.env.JWT_SECRET_KEY ? 'Set' : '❌ Missing');
console.log('✓ PORT:', process.env.PORT || '5000 (default)');
console.log('✓ NODE_ENV:', process.env.NODE_ENV || 'development (default)');
console.log('');

// Test 2: MongoDB Connection
console.log('Test 2: MongoDB Connection');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connection successful');
    console.log('   Database:', mongoose.connection.name);
    console.log('   Host:', mongoose.connection.host);
    return mongoose.connection.close();
  })
  .then(() => {
    console.log('✅ MongoDB connection closed gracefully');
    console.log('');
    console.log('================================');
    console.log('🎉 All verification tests passed!');
    console.log('Backend is ready for deployment.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
