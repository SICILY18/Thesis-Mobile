const express = require('express');
const { Pool } = require('pg');
const cors = require('cors'); // To handle CORS issues during development

const app = express();
const port = process.env.PORT || 3000; // Use environment variable for port, default to 3000

// Configure PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER || 'postgres', // Replace with your DB user
  host: process.env.DB_HOST || '127.0.0.1', // Replace with your DB host
  database: process.env.DB_NAME || 'admin_db', // Replace with your DB name
  password: process.env.DB_PASSWORD || 'Fuckmeharder2003', // Replace with your DB password
  port: process.env.DB_PORT || 5432, // Replace with your DB port
});

// Add middleware
app.use(cors()); // Allow cross-origin requests (useful for development)
app.use(express.json()); // Parse JSON request bodies

// Add a simple GET route for the root path to confirm the server is running
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// --- Login Endpoint ---
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Query the database to find the user
    const result = await pool.query(
      'SELECT * FROM users_tb WHERE username = $1 AND password = $2', // Use parameterized query to prevent SQL injection
      [username, password]
    );

    if (result.rows.length > 0) {
      // User found, login successful
      // In a real app, you would issue a token (e.g., JWT) here instead of sending user data directly
      res.status(200).json({ message: 'Login successful', user: result.rows[0] });
    } else {
      // User not found or credentials incorrect
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).json({ message: 'An error occurred during login' });
  }
});

// --- Start the server ---
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
