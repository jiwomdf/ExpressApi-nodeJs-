const Blog = require('../model/blog')

const blog_index = (req, res) => {
    Blog.find().sort({ createdAt: -1 })
        .then(retval => res.render('index', { title: 'All Blog', blogs: retval }))
        .catch(err => console.log(err))
}

const blog_details = (req, res) => {
    const id = req.params.id

    Blog.findById(id)
        .then(retVal => res.render('detail', { blog: retVal, title: 'Blog Details' }))
        .catch(err => console.log(err))
}

const blog_create_post = (req, res) => {

    const blog = new Blog(req.body)

    blog.save()
        .then(retval => res.redirect('/blogs'))
        .catch(err => console.log(err))
}

const blog_create_get = (req, res) => {
    res.render('createBlog', { title: 'Create a new blog' })
}

const blog_delete = (req, res) => {
    const id = req.params.id

    Blog.findByIdAndDelete(id)
        .then(retVal => res.json({ redirect: '/blogs' }))
        .catch(err => console.log(err))
}

module.exports = {
    blog_index,
    blog_details,
    blog_create_post,
    blog_create_get,
    blog_delete
}