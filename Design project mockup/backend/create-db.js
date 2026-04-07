const { Client } = require('pg');

async function createDatabase() {
  const client = new Client({
    user: 'postgres',
    password: 'ram123',
    host: 'localhost',
    port: 5432,
    database: 'postgres', // Connect to default database
  });

  try {
    await client.connect();
    console.log("Connected to PostgreSQL as postgres.");
    await client.query('CREATE DATABASE smartslot');
    console.log('Database smartslot created successfully');
  } catch (error) {
    if (error.code === '42P04') {
      console.log('Database smartslot already exists');
    } else {
      console.error('Error creating database:', error);
    }
  } finally {
    await client.end();
  }
}

createDatabase();
