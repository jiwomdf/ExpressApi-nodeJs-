const Animal = require('../model/animal')

const animal_index = (req, res) => {
    Animal.find().sort({ createdAt: -1 })
        .then(retval => res.render('index', { title: 'All Animal', blogs: retval }))
        .catch(err => console.log(err))
}

const animal_details = (req, res) => {
    const id = req.params.id

    Animal.findById(id)
        .then(retVal => res.render('detail', { blog: retVal, title: 'Animal Details' }))
        .catch(err => console.log(err))
}

const animal_create_post = (req, res) => {

    const animal = new Animal(req.body)

    animal.save()
        .then(retval => res.redirect('/animal'))
        .catch(err => console.log(err))
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