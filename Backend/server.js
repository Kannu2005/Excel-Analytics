const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

// Load env variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Set default port if not provided
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/excel-analytics';

// Routes
const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);
// Add these routes to your existing server.js
app.use('/api/files', require('./routes/files'));
app.use('/api/charts', require('./routes/charts'));

// Add this line with your other route imports
const adminRoutes = require('./routes/admin');

// Add this line with your other route uses
app.use('/api/admin', adminRoutes);

// Function to create admin user if none exists
const createAdminUser = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const adminUser = new User({
        name: 'Admin User',
        username: 'admin_' + Date.now(),
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin'
      });
      await adminUser.save();
      console.log('✅ Admin user created successfully');
      console.log('📧 Email: keshavkhandelwal876@gmail.com');
      console.log('🔑 Password: keshav@123');
    } else {
      console.log('✅ Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }
};

// MongoDB Connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log("MongoDB connected");

  // Create admin user
  await createAdminUser();

  // Start Server
  app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
  );
}).catch((err) => {
  console.error("MongoDB connection failed:", err.message);
});
