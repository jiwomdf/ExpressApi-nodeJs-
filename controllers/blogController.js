const Blog = require('../model/blog')
const returnFormat = require('../controllers/returnFormat')
const { ObjectId } = require('mongodb')

const blog_get = async (req, res) => {

    try {
        const retVal = await Blog.find().sort({ createdAt: -1 })

        if (retVal)
            returnFormat.success200(res, retVal)
        else
            returnFormat.failed404(res)
    }
    catch (err) {
        returnFormat.error400(res, err)
    }
}

const blog_get_byID = async (req, res) => {
    const id = req.params.id

    try {
        const retVal = await Blog.findById(id)

        if (retVal)
            returnFormat.success200(res, retVal)
        else
            returnFormat.failed404(res)
    }
    catch (err) {
        returnFormat.error400(res, err)
    }
}

const blog_post = async (req, res) => {

    const blog = new Blog(req.body)

    console.log(req.body)
    returnFormat.success200(res, retVal)
    try {
        const retVal = await blog.save()

        if (retVal)
            returnFormat.success200(res, retVal)
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
                (err === null) ? returnFormat.success200(res, retVal) : returnFormat.error400(res)
            )
        })
    }
    catch (err) {
        returnFormat.error400(res, err)
    }
}

const blog_delete = async (req, res) => {
    const id = req.params.id

    try {
        const retVal = await Blog.findByIdAndDelete(id)

        if (retVal)
            returnFormat.success200(res, retVal)
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