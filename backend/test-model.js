require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function testHook() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const user = new User({ name: 'Test Hook', email: 'testhook' + Date.now() + '@example.com', password: 'hookpassword' });
    await user.save();
    console.log('User saved successfully:', user.email);
    process.exit(0);
  } catch (err) {
    console.error('Error saving user:', err);
    process.exit(1);
  }
}

testHook();
