const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const PORT = process.env.PORT || 5000

const db = require('./querys')

express()
  .use(bodyParser.json())
  .use(
    bodyParser.urlencoded({
      extended: true,
    })
  )
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/restaurants', db.getRestaurants )
  .get('/restaurants/statistics', db.getStatistics )
  .get('/restaurants/:id', db.getRestaurantById )
  .post('/restaurants', db.createRestaurant)
  .put('/restaurants/:id', db.updateRestaurant)
  .delete('/restaurants/:id', db.deleteRestaurant)  
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

/*create table Restaurants(id TEXT PRIMARY KEY, rating INTEGER, name TEXT, site TEXT, email TEXT, phone TEXT, street TEXT, city TEXT, state TEXT, lat FLOAT, lng FLOAT);*/
//insert into Restaurants values('851f799f-0852-439e-b9b2-df92c43e7672',1,'Barajas, Bahena and Kano','https://federico.com','Anita_Mata71@hotmail.com','534 814 204','82247 Mariano Entrada','Merida Alfredotown','Durango',19.4400570537131,-99.1270470974249);
