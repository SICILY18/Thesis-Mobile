const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || '127.0.0.1',
  database: process.env.DB_NAME || 'admin_db',
  password: process.env.DB_PASSWORD || 'Fuckmeharder2003',
  port: process.env.DB_PORT || 5432
});

async function syncDatabase() {
  try {
    console.log('Starting database sync...');

    // Drop existing tables
    await pool.query('DROP TABLE IF EXISTS users_tb CASCADE');
    await pool.query('DROP TABLE IF EXISTS customers_tb CASCADE');
    console.log('Dropped existing tables');

    // Create customers table with new schema
    await pool.query(`
      CREATE TABLE customers_tb (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        email VARCHAR(100),
        full_name VARCHAR(100),
        phone_number VARCHAR(20),
        display_name VARCHAR(50),
        profile_picture TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX idx_customers_username ON customers_tb(username);
      CREATE INDEX idx_customers_login ON customers_tb(username, password);
    `);
    console.log('Created customers_tb with updated schema');

    // Insert default customer
    await pool.query(`
      INSERT INTO customers_tb (
        username, 
        password, 
        email, 
        full_name, 
        phone_number, 
        display_name,
        profile_picture
      ) VALUES (
        'admin',
        'admin123',
        'zaynm1299@gmail.com',
        'Faith Jane Cielo Ajoc',
        '+639999742914',
        'sinteyaaa',
        NULL
      );
    `);
    console.log('Inserted default customer data');

    // Verify the table structure
    const tableInfo = await pool.query(`
      SELECT column_name, data_type, column_default, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'customers_tb'
      ORDER BY ordinal_position;
    `);
    console.log('\nTable structure verification:');
    console.table(tableInfo.rows);

    // Verify the customer data
    const customerData = await pool.query('SELECT * FROM customers_tb');
    console.log('\nVerifying customer data:');
    console.table(customerData.rows);

    console.log('\nDatabase sync completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error syncing database:', error);
    process.exit(1);
  }
}

syncDatabase(); 