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
        response.status(201).send(`Restaurant added with ID: ${id}`)
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

function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}
  
function distanceInMBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
    var earthRadiusKm = 6371;

    var dLat = degreesToRadians(lat2-lat1);
    var dLon = degreesToRadians(lon2-lon1);

    lat1 = degreesToRadians(lat1);
    lat2 = degreesToRadians(lat2);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return earthRadiusKm * c * 1000;
}

const getStatistics = (request, response) => {
    const { latitude, longitude, radius } = request.body
    pool.query('SELECT * FROM Restaurants', (error, results) => {
        if (error) {
            throw error
        }
        let ans = {
            count:0,
            avg:0,
            std:0
        }
        //response.status(200).json(results.rows)
        //response.status(200).send(`${ans.count}  hola`);
        let rating = 0;
        for (i in results.rows)
        {
            restaurant = results.rows[i]
            if ( distanceInMBetweenEarthCoordinates(restaurant.lat, restaurant.lng, latitude, longitude) <= radius )
            {
                ans.count = ans.count + 1;
                rating = rating  + restaurant.rating;
            }
        }
        ans.avg = rating / count;
        for (restaurant in results.rows)
        {
            restaurant = results.rows[i]
            if ( distanceInMBetweenEarthCoordinates(restaurant.lat, restaurant.lng, latitude, longitude) <= radius )
            {
                ans.std = (ans.avg - restaurant.rating) * (ans.avg - restaurant.rating);
            }
        }
        ans.std = Mat.sqrt(ans.std / ans.count);
        //response.status(200).json(results)
        response.status(200).send(`${ans.count}  hola`);
    })
}



  

module.exports = {
    getRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
    getStatistics,
}