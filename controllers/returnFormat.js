
function success200(res, retVal) {
    res.status(200).json({
        'status': '200',
        'messages': 'success',
        'data': retVal
    })
}

function noContent204(res, msg) {
    console.log(msg)
    res.status(204).json({
        'status': '204',
        'messages': msg,
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

function unauthorized401(res) {
    res.status(401).json({
        'status': '401',
        'messages': 'unauthorized',
        'data': {}
    })
}

function forbidden403(res) {
    res.status(403).json({
        'status': '403',
        'messages': 'forbidden',
        'data': {}
    })
}

function failed404(res) {
    res.status(404).json({
        'status': '404',
        'messages': 'data not found',
        'data': {}
    })
}

function error500(res, err) {
    console.log(err)
    res.status(500).json({
        'status': '500',
        'messages': err.messages,
        'data': {}
    })
}

module.exports = {
    success200, //success
    noContent204, //no content
    error400, //bad reques
    unauthorized401, //unathorized
    forbidden403, //forbidden
    failed404, //page not found
    error500 //internal server error
}