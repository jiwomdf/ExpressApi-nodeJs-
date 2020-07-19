const Blog = require('../model/blog')
const returnFormat = require('../controllers/returnFormat')
const { ObjectId } = require('mongodb')

const blog_get = (req, res) => {

    try {
        const retVal = await Blog.find().sort({ createdAt: -1 })

        if (retVal)
            returnFormat.success(res, retVal)
        else
            returnFormat.failed404(res)
    }
    catch (err) {
        returnFormat.error400(res, err)
    }
}

const blog_get_byID = (req, res) => {
    const id = req.params.id

    try {
        const retVal = await Blog.findById(id)

        if (retVal)
            returnFormat.success(res, retVal)
        else
            returnFormat.failed404(res)
    }
    catch (err) {
        returnFormat.error400(res, err)
    }
}

const blog_post = (req, res) => {

    const blog = new Blog(req.body)

    try {
        const retVal = await blog.save()

        if (retVal)
            returnFormat.success(res, retVal)
        else
            returnFormat.failed404(res)
    }
    catch (err) {
        returnFormat.error400(res, err)
    }

}

const blog_patch = async (req, res) => {

    const id = req.params.id

    try {
        await Blog.updateOne({ _id: ObjectId(id) }, req.body, (err, retVal) => {
            res.send(
                (err === null) ? returnFormat.success(res, retVal) : returnFormat.error400(res)
            )
        })
    }
    catch (err) {
        returnFormat.error400(res, err)
    }
}

const blog_delete = (req, res) => {
    const id = req.params.id

    try {
        const retVal = await Blog.findByIdAndDelete(id)

        if (retVal)
            returnFormat.success(res, retVal)
        else
            returnFormat.failed404(res)
    }
    catch (err) {
        returnFormat.error400(res, err)
    }

}

module.exports = {
    blog_get,
    blog_get_byID,
    blog_post,
    blog_patch,
    blog_delete
}