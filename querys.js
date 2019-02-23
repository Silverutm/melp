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


const getRestaurantById = (request, response) => {
    const id = request.params.id
  
    pool.query('SELECT * FROM Restaurants WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const createRestaurant = (request, response) => {
    const { id, rating, name, site, email, phone, street, city, state, lat, lng } = request.body
    const intRating = parseInt(rating)
    const floatLat = parseFloat(lat)
    const floatLng = parseFloat(lng)
  
    pool.query('INSERT INTO Restaurants (id, rating, name, site, email, phone, street, city, state, lat, lng) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)', [id, intRating, name, site, email, phone, street, city, state, floatLat, floatLng], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).send(`Restaurant added with ID: ${result.insertId}`)
    })
}


const updateRestaurant = (request, response) => {
    const id = request.params.id
    const { rating, name, site, email, phone, street, city, state, lat, lng } = request.body
    const intRating = parseInt(rating)
    const floatLat = parseFloat(lat)
    const floatLng = parseFloat(lng)
  
    pool.query(
        'UPDATE Restaurants SET rating = $2, name = $3, site = $4, email = $5, phone = $6, street = $7, city = $8, state = $9, lat = $10, lng = $11 WHERE id = $1',
        [id, intRating, name, site, email, phone, street, city, state, floatLat, floatLng],
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).send(`Restaurant modified with ID: ${id}`)
        }
    )
}


const deleteRestaurant = (request, response) => {
    const id = request.params.id
  
    pool.query('DELETE FROM Restaurants WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`Restaurant deleted with ID: ${id}`)
    })
}

module.exports = {
    getRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
}