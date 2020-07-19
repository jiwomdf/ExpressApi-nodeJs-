const Animal = require('../model/animal')

const animal_index = async (req, res) => {

    try {
        const retVal = await Animal.find().sort({ createdAt: -1 })

        res.status(200).json({
            'status': '200',
            'messages': 'success',
            'data': retVal
        })
    }
    catch (err) {
        console.log(err)
    }

    console.log("masuk_get")
}

const animal_details = (req, res) => {
    const id = req.params.id

    Animal.findById(id)
        .then(retVal => res.render('detail', { blog: retVal, title: 'Animal Details' }))
        .catch(err => console.log(err))
}

const animal_create_post = async (req, res) => {

    const animal = new Animal(req.body)

    const retVal = await animal.save()

    try {
        res.status(200).json({
            'status': '200',
            'messages': 'success',
            'data': retVal
        })
    }
    catch (ex) {
        console.log(err)
    }
}

const animal_create_get = (req, res) => {
    res.render('createAnimal', { title: 'Create new Animal' })
}

const animal_delete = (req, res) => {
    const id = req.params.id

    Animal.findByIdAndDelete(id)
        .then(retVal => res.json({ redirect: '/animal' }))
        .catch(err => console.log(err))
}

module.exports = {
    animal_index,
    animal_details,
    animal_create_post,
    animal_create_get,
    animal_delete
}