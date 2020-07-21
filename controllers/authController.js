const login = async (req, res) => {
    res.status(200).json({
        'auth-key': 'mantap'
    })
}

module.exports = {
    login
}