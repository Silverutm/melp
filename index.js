const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000


const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});



express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/times', (req, res) => res.send(showTimes()))
  .get('/db', async (req, res) => {
    try {
      const client = await pool.connect()
      const result = await client.query('SELECT * FROM otra');
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/db', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  .get('/restaurants', async (req, res) => res.send(getRestaurants()))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))




showTimes = () => {
    let result = ''
    const times = process.env.TIMES || 5
    for (i = 0; i < times; i++) {
        result += i + ' '
    }
    return result;
}

const getRestaurants = (request, response) => {
    pool.query('SELECT * FROM Restaurants', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }


/*create table Restaurants(id TEXT PRIMARY KEY, rating INTEGER, name TEXT, site TEXT, email TEXT, phone TEXT, street TEXT, city TEXT, state TEXT, lat FLOAT, lng FLOAT)*/
//insert into Restaurants values('851f799f-0852-439e-b9b2-df92c43e7672',1,'Barajas, Bahena and Kano','https://federico.com','Anita_Mata71@hotmail.com','534 814 204','82247 Mariano Entrada','Merida Alfredotown','Durango',19.4400570537131,-99.1270470974249)


//create table otra (id TEXT PRIMARY KEY, name text);
//insert into otra values('23', '323');
//insert into otra values('hola', '323');