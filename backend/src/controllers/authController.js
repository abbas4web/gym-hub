const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');

// Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    // Check if user exists
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        return res.status(500).json({ success: false, error: 'Database error' });
      }

      if (user) {
        return res.status(400).json({ success: false, error: 'Email already registered' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = uuidv4();

      // Create user
      db.run(
        'INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)',
        [userId, name, email, hashedPassword],
        function(err) {
          if (err) {
            console.error('Failed to create user:', err);
            return res.status(500).json({ success: false, error: 'Failed to create user: ' + err.message });
          }

          console.log('User created successfully:', userId);

          // Create default subscription
          const subscriptionId = uuidv4();
          db.run(
            'INSERT INTO subscriptions (id, user_id, plan, start_date) VALUES (?, ?, ?, ?)',
            [subscriptionId, userId, 'free', new Date().toISOString()],
            (err) => {
              if (err) console.error('Failed to create subscription:', err);
              else console.log('Subscription created successfully:', subscriptionId);
            }
          );

          // Generate JWT
          const token = jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
            expiresIn: '30d'
          });

          res.status(201).json({
            success: true,
            token,
            user: { id: userId, name, email }
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        return res.status(500).json({ success: false, error: 'Database error' });
      }

      if (!user) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }

      // Generate JWT
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: '30d'
      });

      res.json({
        success: true,
        token,
        user: { id: user.id, name: user.name, email: user.email }
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get current user
exports.getCurrentUser = (req, res) => {
  db.get('SELECT id, name, email, created_at FROM users WHERE id = ?', [req.userId], (err, user) => {
    if (err) {
      return res.status(500).json({ success: false, error: 'Database error' });
    }

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({ success: true, user });
  });
};
