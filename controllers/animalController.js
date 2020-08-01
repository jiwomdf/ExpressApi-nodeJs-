const Animal = require('../model/animal')
const returnFormat = require('../controllers/returnFormat')
const Joi = require('@hapi/joi')
const { ObjectId } = require('mongodb')

const animal_get = async (req, res) => {

    try {
        const retVal = await Animal.find().sort({ createdAt: -1 })

        if (retVal)
            returnFormat.success200(res, retVal)
        else
            returnFormat.failed404(res)
    }
    catch (err) {
        returnFormat.error400(res, err)
    }
}

const animal_get_byID = async (req, res) => {
    const id = req.params.id

    try {
        const retVal = await Animal.findById(id)

        if (retVal)
            returnFormat.success200(res, retVal)
        else
            returnFormat.failed404(res)
    }
    catch (err) {
        returnFormat.error400(res, err)
    }
}

const animal_get_with_img = async (req, res) => {

    try {
        const dbRetVal = await Animal.aggregate([
            {
                $lookup:
                {
                    from: "images",
                    localField: "binaryImage",
                    foreignField: "originalname",
                    as: "animal_pic"
                }
            },
            { $unwind: '$animal_pic' }
        ])

        let listRetVal = []
        dbRetVal.forEach(itm => {
            const retVal = {
                "tags": itm.tags,
                "name": itm.name,
                "story": itm.story,
                "expression": itm.expression,
                "diet": itm.diet,
                "isBaby": itm.isBaby,
                "isOneAnimal": itm.isOneAnimal,
                "binaryImage": itm.binaryImage,
                "destination": itm.animal_pic.destination,
                "imagePath": `${process.env.SERVER_PUBLIC_URL}${itm.animal_pic.originalname}.jpg`
            }

            listRetVal.push(retVal)
        })

        if (listRetVal)
            returnFormat.success200(res, listRetVal)
        else
            returnFormat.failed404(res)
    }
    catch (err) {
        returnFormat.error400(res, err)
    }
}

const animal_get_with_img_dynamicParam = async (req, res) => {

    try {
        let dbRetVal
        console.log(req.body)
        if (req.body.isBaby == false && req.body.isOneAnimal == false && req.body.expression == '' && req.body.diet == '') {
            dbRetVal = await Animal.aggregate([
                {
                    $lookup:
                    {
                        from: "images",
                        localField: "binaryImage",
                        foreignField: "originalname",
                        as: "animal_pic"
                    }
                },
                { $unwind: '$animal_pic' }
            ])
        }
        else {

            let query = {} // declare the query object
            query['$and'] = [] // filter the search by any criteria given by the user
            if (req.body.diet != null && req.body.diet != undefined && req.body.diet != '') // if the criteria has a value or values
                query["$and"].push({ diet: req.body.diet }) // add to the query object

            if (req.body.expression != null && req.body.expression != undefined && req.body.expression != '')
                query["$and"].push({ expression: req.body.expression })

            if (req.body.isBaby != null && req.body.isBaby != undefined && req.body.isBaby != false) // if the criteria has a value or values
                query["$and"].push({ isBaby: req.body.isBaby })

            if (req.body.isOneAnimal != null && req.body.isOneAnimal != undefined && req.body.isOneAnimal != false) // if the criteria has a value or values
                query["$and"].push({ isOneAnimal: req.body.isOneAnimal })

            dbRetVal = await Animal.aggregate([
                {
                    $lookup:
                    {
                        from: "images",
                        localField: "binaryImage",
                        foreignField: "originalname",
                        as: "animal_pic"
                    }
                },
                { $unwind: '$animal_pic' },
                { "$match": query }
            ])
        }

        let listRetVal = []
        dbRetVal.forEach(itm => {
            const retVal = {
                "tags": itm.tags,
                "name": itm.name,
                "story": itm.story,
                "expression": itm.expression,
                "diet": itm.diet,
                "isBaby": itm.isBaby,
                "isOneAnimal": itm.isOneAnimal,
                "binaryImage": itm.binaryImage,
                "destination": itm.animal_pic.destination,
                "imagePath": `${process.env.SERVER_PUBLIC_URL}${itm.animal_pic.originalname}.jpg`
            }

            listRetVal.push(retVal)
        })

        if (listRetVal)
            returnFormat.success200(res, listRetVal)
        else
            returnFormat.failed404(res)
    }
    catch (err) {
        returnFormat.error400(res, err)
    }
}

const animal_get_with_img_byUserName = async (req, res) => {

    const userName = req.params.userName

    try {
        const dbRetVal = await Animal.aggregate([
            {
                $match: {
                    userName: { $regex: userName }
                }
            },
            {
                $lookup:
                {
                    from: "images",
                    localField: "binaryImage",
                    foreignField: "originalname",
                    as: "animal_pic"
                }
            },
            { $unwind: '$animal_pic' }
        ])

        let listRetVal = []
        dbRetVal.forEach(itm => {
            const retVal = {
                "animalID": itm._id,
                "imgID": itm.animal_pic._id,
                "tags": itm.tags,
                "name": itm.name,
                "story": itm.story,
                "expression": itm.expression,
                "diet": itm.diet,
                "isBaby": itm.isBaby,
                "isOneAnimal": itm.isOneAnimal,
                "binaryImage": itm.binaryImage,
                "destination": itm.animal_pic.destination,
                "imagePath": `${process.env.SERVER_PUBLIC_URL}${itm.animal_pic.originalname}.jpg`
            }

            listRetVal.push(retVal)
        })

        if (listRetVal)
            returnFormat.success200(res, listRetVal)
        else
            returnFormat.failed404(res)
    }
    catch (err) {
        returnFormat.error400(res, err)
    }
}

const animal_post = async (req, res) => {

    let validate = await validateAnimalPost(req.body)
    if (!validate.isValid) returnFormat.validate422(res, validate.message)

    const animal = new Animal(req.body)

    try {
        const retVal = await animal.save()

        if (retVal)
            returnFormat.success200(res, retVal)
        else
            returnFormat.failed404(res)
    }
    catch (err) {
        returnFormat.error400(res, err)
    }
}

const animal_patch = async (req, res) => {

    let validate = await validateAnimalPost(req.body)
    if (!validate.isValid) return returnFormat.validate422(res, validate.message)

    const id = req.params.id

    try {
        await Animal.updateOne({ _id: ObjectId(id) }, req.body, (err, retVal) => {
            res.send(
                (err === null) ? returnFormat.success200(res, retVal) : returnFormat.error400(res)
            )
        })
    }
    catch (err) {
        returnFormat.error400(res, err)
    }
}

const animal_delete = async (req, res) => {
    const id = req.params.id

    try {
        const retVal = await Animal.findByIdAndDelete(id)

        if (retVal)
            returnFormat.success200(res, retVal)
        else
            returnFormat.failed404(res)
    }
    catch (err) {
        returnFormat.error400(res, err)
    }
}

/* Supporting functon */
const validateAnimalPost = async (animal) => {

    const schema = Joi.object({
        name: Joi.string().min(1).max(30).required(),

        expression: Joi.string()
            .valid("Happy", "Sad", "Inocent", "Cry")
            .required(),

        diet: Joi.string()
            .valid("Herbivore", "Carnivore", "Omnivore")
            .required(),

        isBaby: Joi.boolean().required(),
        isOneAnimal: Joi.boolean().required(),
        binaryImage: Joi.string().min(10).max(100).required(),
        tags: Joi.array().items(Joi.string()),
        story: Joi.string().min(0).max(200).allow(''),
        userName: Joi.string().required()
    })

    try {
        const result = await schema.validate(animal)

        if (result.error == null) return { isValid: true, message: "" }
        else return { isValid: false, message: result.error.toString() }
    }
    catch (err) {
        return { isValid: false, message: err.details[0].message }
    }

}

module.exports = {
    animal_get,
    animal_get_byID,
    animal_get_with_img,
    animal_post,
    animal_patch,
    animal_delete,
    animal_get_with_img_byUserName,
    animal_get_with_img_dynamicParam
}