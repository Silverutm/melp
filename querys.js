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


const getRestaurantsById = (request, response) => {
    const id = parseInt(request.params.id)
  
    pool.query('SELECT * FROM Restaurants WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}


module.exports = {
    getRestaurants,
    getRestaurantsById,
}