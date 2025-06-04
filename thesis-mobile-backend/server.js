const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS with specific options
app.use(cors({
  origin: '*',  // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from uploads directory with CORS
app.use('/uploads', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
}, express.static(uploadsDir));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, 'profile-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
}).single('photo');

// Configure PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || '127.0.0.1',
  database: process.env.DB_NAME || 'admin_db',
  password: process.env.DB_PASSWORD || 'Fuckmeharder2003',
  port: process.env.DB_PORT || 5432,
  max: 20
});

// Initialize database
async function initializeDatabase() {
  try {
    // Create table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS customers_tb (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        phone_number VARCHAR(20) NOT NULL,
        profile_picture BYTEA,
        profile_picture_type VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_customers_username ON customers_tb(username);
      CREATE INDEX IF NOT EXISTS idx_customers_login ON customers_tb(username, password);
    `);
    
    // Ensure default admin user exists and has the correct password
    const adminUsername = 'admin';
    const defaultAdminPassword = 'admin123';
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(defaultAdminPassword, saltRounds);

    // Check if admin user exists
    const existingAdminResult = await pool.query(
      'SELECT id FROM customers_tb WHERE username = $1',
      [adminUsername]
    );

    if (existingAdminResult.rows.length > 0) {
      // Admin exists, update its password to ensure it's correct
      await pool.query(
        'UPDATE customers_tb SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE username = $2',
        [hashedPassword, adminUsername]
      );
      console.log('Default admin user found and password ensured.');
    } else {
      // Admin does not exist, insert it
      await pool.query(`
        INSERT INTO customers_tb (
          username, password, email, first_name, last_name, full_name, phone_number
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          adminUsername, hashedPassword, 'zaynm1299@gmail.com',
          'Faith Jane', 'Cielo Ajoc', 'Faith Jane Cielo Ajoc', '+639999742914'
        ]
      );
      console.log('Default admin user created.');
    }

    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
    process.exit(1);
  }
}

// Test endpoint to verify server is running
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    console.log('Attempting login for username:', username);
    const result = await pool.query(
      'SELECT * FROM customers_tb WHERE username = $1',
      [username]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];
      // Compare hashed password
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        console.log('Login successful for user:', user.username);
        // Exclude password from user object sent to client
        const { password: _, ...userWithoutPassword } = user;
        res.status(200).json({
          message: 'Login successful',
          user: userWithoutPassword
        });
      } else {
        console.log('Login failed: Invalid credentials (password mismatch)');
        res.status(401).json({ message: 'Invalid username or password' });
      }
    } else {
      console.log('Login failed: Invalid credentials (user not found)');
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).json({ message: 'An error occurred during login' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

// Update profile picture endpoint
app.post('/api/customers/:id/profile-picture', async (req, res) => {
  console.log('Profile picture upload request received for customer ID:', req.params.id);
  
  // Ensure response will be JSON
  res.setHeader('Content-Type', 'application/json');

  // Handle file upload
  upload(req, res, async function(err) {
    try {
      if (err instanceof multer.MulterError) {
        console.error('Multer error:', err);
        return res.status(400).json({
          success: false,
          message: 'File upload error',
          error: err.message
        });
      } else if (err) {
        console.error('Upload error:', err);
        return res.status(500).json({
          success: false,
          message: 'Error uploading file',
          error: err.message
        });
      }

      // Check if file exists
      if (!req.file) {
        console.error('No file uploaded');
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      console.log('File received:', {
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size
      });

      // Read file and update database
      const fileData = await fs.promises.readFile(req.file.path);
      
      const result = await pool.query(
        `UPDATE customers_tb 
         SET profile_picture = $1,
             profile_picture_type = $2,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $3
         RETURNING id, username, email, full_name, phone_number, updated_at`,
        [fileData, req.file.mimetype, req.params.id]
      );

      // Clean up uploaded file
      await fs.promises.unlink(req.file.path);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
      }

      console.log('Profile picture updated successfully');
      return res.status(200).json({
        success: true,
        message: 'Profile picture updated successfully',
        user: result.rows[0]
      });

    } catch (error) {
      console.error('Server error:', error);
      
      // Clean up file if it exists
      if (req.file) {
        try {
          await fs.promises.unlink(req.file.path);
        } catch (unlinkError) {
          console.error('Error deleting uploaded file:', unlinkError);
        }
      }

      return res.status(500).json({
        success: false,
        message: 'Server error while processing upload',
        error: error.message
      });
    }
  });
});

// Get profile picture endpoint
app.get('/api/customers/:id/profile-picture', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT profile_picture, profile_picture_type FROM customers_tb WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0 || !result.rows[0].profile_picture) {
      return res.status(404).json({
        success: false,
        message: 'Profile picture not found'
      });
    }

    const { profile_picture, profile_picture_type } = result.rows[0];
    res.setHeader('Content-Type', profile_picture_type);
    return res.send(profile_picture);

  } catch (error) {
    console.error('Error retrieving profile picture:', error);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving profile picture',
      error: error.message
    });
  }
});

// Update customer profile endpoint
app.put('/api/customers/:id', async (req, res) => {
  const { id } = req.params;
  console.log('Updating profile for customer ID:', id);
  console.log('Request body:', req.body);

  try {
    // Basic validation
    if (!id) {
      console.log('Missing ID parameter');
      return res.status(400).json({ message: 'Customer ID is required' });
    }

    const { username, first_name, last_name, email, phone_number } = req.body;

    // Log received data
    console.log('Received data:', {
      username,
      first_name,
      last_name,
      email,
      phone_number
    });

    // Validate required fields
    const requiredFields = ['username', 'first_name', 'last_name', 'email', 'phone_number'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      console.log('Missing required fields:', missingFields);
      return res.status(400).json({
        message: 'Missing required fields',
        missingFields: missingFields
      });
    }

    // Check if customer exists
    const existingCustomer = await pool.query(
      'SELECT * FROM customers_tb WHERE id = $1',
      [id]
    );

    if (existingCustomer.rows.length === 0) {
      console.log('Customer not found with ID:', id);
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Check if username is taken by another user
    const usernameCheck = await pool.query(
      'SELECT id FROM customers_tb WHERE username = $1 AND id != $2',
      [username, id]
    );

    if (usernameCheck.rows.length > 0) {
      console.log('Username already taken:', username);
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Combine first_name and last_name for full_name
    const full_name = `${first_name} ${last_name}`.trim();

    // Update customer profile
    console.log('Updating customer profile with:', {
      username,
      first_name,
      last_name,
      full_name,
      email,
      phone_number
    });

    const result = await pool.query(
      `UPDATE customers_tb 
       SET username = $1,
           first_name = $2,
           last_name = $3,
           full_name = $4,
           email = $5,
           phone_number = $6,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING *`,
      [username, first_name, last_name, full_name, email, phone_number, id]
    );

    console.log('Update result:', result.rows[0]);

    res.json({
      message: 'Profile updated successfully',
      user: result.rows[0]
    });

  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({
      message: 'An error occurred while updating profile',
      error: err.message
    });
  }
});

// Change password endpoint
app.put('/api/customers/:id/password', async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  try {
    const customerResult = await pool.query(
      'SELECT id, password FROM customers_tb WHERE id = $1',
      [id]
    );

    if (customerResult.rows.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const customer = customerResult.rows[0];
    const match = await bcrypt.compare(currentPassword, customer.password);

    if (!match) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    await pool.query(
      'UPDATE customers_tb SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [hashedNewPassword, id]
    );

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error changing password:', err);
    res.status(500).json({ message: 'An error occurred while changing password' });
  }
});

// Get All Customers Endpoint
app.get('/api/customers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customers_tb');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching customers:', err);
    res.status(500).json({ message: 'Error fetching customers' });
  }
});

// CRUD Operations for Accounts

// Create new customer account
app.post('/api/customers', async (req, res) => {
  const { username, password, email, first_name, last_name, phone_number } = req.body;

  try {
    // Validate required fields
    const requiredFields = ['username', 'password', 'email', 'first_name', 'last_name', 'phone_number'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: 'Missing required fields',
        missingFields: missingFields
      });
    }

    // Check if username already exists
    const existingUser = await pool.query(
      'SELECT username FROM customers_tb WHERE username = $1',
      [username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Combine first_name and last_name for full_name
    const full_name = `${first_name} ${last_name}`.trim();

    // Hash the password before storing
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await pool.query(
      `INSERT INTO customers_tb
       (username, password, email, first_name, last_name, full_name, phone_number)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [username, hashedPassword, email, first_name, last_name, full_name, phone_number]
    );
    
    // Exclude password from user object sent to client
    const { password: _, ...userWithoutPassword } = result.rows[0];

    res.status(201).json({
      message: 'Account created successfully',
      user: userWithoutPassword
    });
  } catch (err) {
    console.error('Error creating customer:', err);
    res.status(500).json({ message: 'An error occurred while creating account' });
  }
});

// Get single customer by ID
app.get('/api/customers/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM customers_tb WHERE id = $1',
      [id]
    );

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (err) {
    console.error('Error fetching customer:', err);
    res.status(500).json({ message: 'Error fetching customer details' });
  }
});

// Delete customer account
app.delete('/api/customers/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Check if customer exists
    const customer = await pool.query(
      'SELECT profile_picture FROM customers_tb WHERE id = $1',
      [id]
    );

    if (customer.rows.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Delete profile picture if exists
    if (customer.rows[0].profile_picture) {
      const profilePicPath = customer.rows[0].profile_picture;
      const fileName = profilePicPath.split('/').pop();
      const filePath = path.join(uploadsDir, fileName);
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Delete customer record
    await pool.query(
      'DELETE FROM customers_tb WHERE id = $1',
      [id]
    );

    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    console.error('Error deleting customer:', err);
    res.status(500).json({ message: 'An error occurred while deleting account' });
  }
});

// Search customers
app.get('/api/customers/search', async (req, res) => {
  const { query } = req.query;

  try {
    const result = await pool.query(
      `SELECT * FROM customers_tb 
       WHERE username ILIKE $1 
       OR full_name ILIKE $1 
       OR display_name ILIKE $1`,
      [`%${query}%`]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error searching customers:', err);
    res.status(500).json({ message: 'Error searching customers' });
  }
});

// Initialize database and start server
initializeDatabase()
  .then(() => {
    app.listen(port, '0.0.0.0', () => {
      console.log(`\nServer running on port ${port}`);
      
      // Log all available IP addresses
      const { networkInterfaces } = require('os');
      const nets = networkInterfaces();
      console.log('\nAvailable IP addresses:');
      
      for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
          // Skip over non-IPv4 and internal addresses
          if (net.family === 'IPv4' && !net.internal) {
            console.log(`- http://${net.address}:${port}`);
          }
        }
      }
      
      console.log('\nFor Android Emulator use: http://10.0.2.2:3000');
      console.log('For iOS Simulator use: http://localhost:3000');
      console.log('For real devices, use one of the IP addresses above\n');
    });
  })
  .catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
