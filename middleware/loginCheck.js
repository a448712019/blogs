const { ErrorModal } = require('../model/resModel')

module.exports = (req, res, next) => { 
    if(req.session.username){
        next()
        return
    }
    res.json(
        new ErrorModal('未登录')
    )
}