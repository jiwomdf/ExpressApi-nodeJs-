const Image = require('../model/image')
const returnFormat = require('../controllers/returnFormat')


const upload_post = async (req, res) => {

    let isValid = validateImg(req.file)
    if (!isValid) returnFormat.error400(res, "rijected on validation upload_post")

    const image = new Image(req.file)

    // try {
    //     const retVal = await image.save()

    //     if (retVal)
    //         returnFormat.success200(res, retVal)
    //     else
    //         returnFormat.failed404(res)
    // }
    // catch (err) {
    //     returnFormat.error400(res, err)
    // }

    console.log(req.file)
}

module.exports = {
    upload_post
}