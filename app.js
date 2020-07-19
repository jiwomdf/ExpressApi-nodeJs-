const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const blogRoutes = require('./routes/blogRoutes')
const animalRoutes = require('./routes/animalRoutes')
const bodyParser = require('body-parser')

const app = express()

// connect to mongoDB
const dbURI = 'mongodb://192.168.99.100:27019/?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false'
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(res => {
        app.listen(3000)
        console.log("app listen in 3000")
    })
    .catch(err => console.log(err))

//middleware & static files
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//routes
app.use('/blogs/', blogRoutes)
app.use('/animal/', animalRoutes)

//register view engine
app.set('view engine', 'ejs') // --> default looking in `views` directory

app.get('/', (req, res) => {
    res.redirect('/blogs')
})


/* 404 page must be in the bottom */
// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404' })
})
