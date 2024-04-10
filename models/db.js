const { Pool } = require('pg');

// THis simply connects to the pg database
const pool = new Pool({
    user: 'postgres',
    password: 'Neededmoss11',
    database: 'cooking_and_baking',
    host: 'localhost',
    port: 5432,
});

module.exports = pool;
