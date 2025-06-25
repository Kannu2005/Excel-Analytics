const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'Name, email and password are required' });
    }

    // Validate role
    if (role && !['user', 'admin'].includes(role)) {
      return res.status(400).json({ msg: 'Invalid role. Must be either "user" or "admin"' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ msg: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate username from email
    const username = email.split('@')[0] + '_' + Date.now();

    const user = new User({
      name,
      username,
      email,
      password: hashedPassword,
      role: role || 'user'
    });

    console.log('Attempting to save user:', user);
    await user.save();
    console.log('User saved successfully:', user);
    res.status(201).json({ msg: 'User registered successfully' });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// Login a user
exports.login = async (req, res) => {
  console.log('Login request body:', req.body); // Debug log
  const { email, password } = req.body;

  if (!email) {
    console.log('Login error: Missing email');
    return res.status(400).json({ msg: 'Email is required' });
  }
  if (!password) {
    console.log('Login error: Missing password');
    return res.status(400).json({ msg: 'Password is required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Login error: User not found for email', email);
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Login error: Incorrect password for email', email);
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log('Login success for email', email);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// Get user info
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error });
  }
};
