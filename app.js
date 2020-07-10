const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const Blog = require('./model/blog')

const app = express()

// connect to mongoDB
const dbURI = 'mongodb+srv://expressApi:MantapDjiwa123@nodetuts.akanr.mongodb.net/note-tuts?retryWrites=true&w=majority'
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(res => app.listen(3000))
    .catch(err => console.log(err))

//middleware & static files
app.use(express.static('public'))
app.use(morgan('dev'))

/*
//mongoose and mongo sandbox routes
app.get('/add-blog', (req, res) => {
    const blog = new Blog({
        title: 'new blog 2',
        snippet: 'about my new blog 2',
        body: 'more about my new blog 2'
    })

    blog.save()
        .then(retval => res.send(retval))
        .catch(err => console.log(err))
})

app.get('/all-blogs', (req, res) => {
    Blog.find()
        .then(retval => res.send(retval))
        .catch(err => console.log(err))
})

app.get('/single-blog', (req, res) => {
    Blog.findById('5f0833c3cfce761fe4bf592a')
        .then(retval => res.send(retval))
        .catch(err => console.log(err))
})
*/

//register view engine
app.set('view engine', 'ejs') // --> default looking in `views` directory

app.get('/', (req, res) => {
    res.redirect('/blogs')
})

//blog routes
app.get('/blogs', (req, res) => {
    Blog.find().sort({ createdAt: -1 })
        .then(retval => {
            res.render('index', { title: 'All Blog', blogs: retval })
        })
        .catch(err => console.log(err))
})

app.get('/about', (req, res) => {
    res.render('about', { title: 'About' })
})

app.get('/blogs/create', (req, res) => {
    res.render('create', { title: 'Create a new blog' })
})


/* 404 page must be in the bottom */
// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404' })
})
