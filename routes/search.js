const express = require('express');  // Import the Express framework
const router = express.Router();     // Create a router instance
const db = require('../models/db');  // Import the database module
const mongodb = require('../models/mongodb'); // Import the MongoDB module
const pool = require('../models/db'); // Import the database connection pool

// Function for logging searches to the PostgreSQL database
async function logQuery(user_id, query_keyword) {
  const datetime = new Date();
  const insertQuery = `
    INSERT INTO query_logs (user_id, query_keyword, datetime)
    VALUES ($1, $2, $3)
  `;

  try {
    await pool.query(insertQuery, [user_id, query_keyword, datetime]); // Execute the query to log the search
  } catch (error) {
    console.error('Error logging query:', error); // Handle any errors that occur
  }
}

// Search route
router.get('/', async (req, res) => {
  try {
    const query = req.query.query;
    const database = req.query.database;
    const searchType = req.query.searchType;
    const user_id = req.user.id; // Get the user ID from the request's user object

    await logQuery(user_id, query); // Call the logQuery function to log the search

    let recipes = [];
    let selectedDatabase = database;

    // Search in PostgreSQL database
    if (database === 'postgre' || database === 'both') {
      let pgQuery;
      if (searchType === 'exact') {
        // Construct the SQL query for exact matching
        pgQuery = `
          SELECT * FROM recipes WHERE
          CAST(recipe_id AS TEXT) = $1 OR
          title = $2 OR
          ingredients = $3 OR
          instructions = $4 OR
          prep_time = $5 OR
          cook_time = $6 OR
          total_time = $7 OR
          servings = $8
        `;
        const pgRecipes = await db.query(
          pgQuery,
          [
            query, query, query, query,
            query, query, query, query
          ]
        );
        recipes.push(...pgRecipes.rows);
      } else if (searchType === 'keyword') {
        // Construct the SQL query for keyword matching
        pgQuery = `
          SELECT * FROM recipes WHERE
          CAST(recipe_id AS TEXT) ILIKE $1 OR
          title ILIKE $2 OR
          ingredients ILIKE $3 OR
          instructions ILIKE $4 OR
          prep_time ILIKE $5 OR
          cook_time ILIKE $6 OR
          total_time ILIKE $7 OR
          servings ILIKE $8
        `;
        const pgRecipes = await db.query(
          pgQuery,
          [
            `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`,
            `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`
          ]
        );
        recipes.push(...pgRecipes.rows);
      }
    }

    // Search in MongoDB database
    if (database === 'mongo' || database === 'both') {
      await mongodb.connectToDatabase(); // Connect to the MongoDB database

      const client = mongodb.getClient(); // Get the MongoDB client
      const db = client.db('cooking_and_baking');
      const collection = db.collection('recipes'); // Get the collection 'recipes'

      let mongoQuery;

      if (searchType === 'exact') {
        // Construct the MongoDB query for exact matching
        mongoQuery = {
          $or: [
            { recipe_id: query },
            { title: query },
            { ingredients: query },
            { instructions: query },
            { prep_time: query },
            { cook_time: query },
            { total_time: query },
            { servings: query }
          ]
        };
      } else if (searchType === 'keyword') {
        // Construct the MongoDB query for keyword matching
        mongoQuery = {
          $or: [
            { recipe_id: { $regex: query, $options: 'i' } },
            { title: { $regex: query, $options: 'i' } },
            { ingredients: { $regex: query, $options: 'i' } },
            { instructions: { $regex: query, $options: 'i' } },
            { prep_time: { $regex: `\\b${query}\\b`, $options: 'i' } },
            { cook_time: { $regex: query, $options: 'i' } },
            { total_time: { $regex: query, $options: 'i' } },
            { servings: { $regex: query, $options: 'i' } }
          ]
        };
      }

      const mongoRecipes = await collection.find(mongoQuery).toArray(); // Execute the MongoDB query
      recipes.push(...mongoRecipes);

      await client.close(); // Close the MongoDB client connection
    }

    res.render('search_results', { recipes, selectedDatabase }); // Render the search results page
  } catch (err) {
    console.error('Error executing search query:', err); // Handle any errors that occur
    res.send('An error occurred while searching.'); // Send an error response
  }
});

module.exports = router; // Export the router for use in other modules







