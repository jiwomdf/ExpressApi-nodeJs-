require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
const blogRoutes = require('./routes/blogRoutes')
const animalRoutes = require('./routes/animalRoutes')
const userRoutes = require('./routes/userRoutes')
const authRoutes = require('./routes/authRoutes')

const app = express()

// connect to mongoDB
const dbURI = 'mongodb://192.168.99.100:27019/AnimalDatabase'
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(res => {
        app.listen(3000)
        console.log("app listen in 3000")
    })
    .catch(err => console.log(err))

//middleware
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

//routes
app.use('/blog/', blogRoutes)
app.use('/animal/', animalRoutes)
app.use('/user/', userRoutes)
app.use('/auth/', authRoutes)

app.use((req, res) => {
    res.status(404).send('404 not found')
})

