const Animal = require('../model/animal')
const returnFormat = require('../controllers/returnFormat')


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


module.exports = {
    animal_get_with_img,
    animal_get_with_img_byUserName,
    animal_get_with_img_dynamicParam
}