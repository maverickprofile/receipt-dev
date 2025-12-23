// Run this script to create the database tables
// Usage: node db/migrate.js

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function migrate() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
        console.error('ERROR: DATABASE_URL environment variable is not set');
        console.log('Please set it in your .env file or as an environment variable');
        process.exit(1);
    }

    const pool = new Pool({ connectionString });

    try {
        console.log('Connecting to database...');

        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        console.log('Running migrations...');
        await pool.query(schema);

        console.log('✓ Database schema created successfully!');
        console.log('');
        console.log('Tables created:');
        console.log('  - user');
        console.log('  - session');
        console.log('  - account');
        console.log('  - verification');

    } catch (error) {
        console.error('Migration failed:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

// Load .env file
require('dotenv').config();

migrate();
