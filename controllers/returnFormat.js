
function success200(res, retVal) {
    res.status(200).json({
        'status': '200',
        'messages': 'success',
        'data': retVal
    })
}

function failed404(res) {
    res.status(404).json({
        'status': '404',
        'messages': 'data not found',
        'data': {}
    })
}

function error400(res, err) {
    console.log(err)
    res.status(400).json({
        'status': '400',
        'messages': err.messages,
        'data': {}
    })
}

function error500(res, err) {
    console.log(err)
    res.status(400).json({
        'status': '400',
        'messages': err.messages,
        'data': {}
    })
}

module.exports = {
    success200, //success
    failed404, //page not found
    error400, //bad request,
    error500 //internal server error
}