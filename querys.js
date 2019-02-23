const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});


const getRestaurants = (request, response) => {
    pool.query('SELECT * FROM Restaurants', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }



module.exports = {
    getRestaurants,
}