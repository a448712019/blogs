const { login } = require('../controller/user')
const { SuccessModal, ErrorModal } = require('../model/resModel')
const { set } = require('../db/redis')

const handleUserRouter = (req, res) => {
    const method = req.method 
    console.log('req.body', req.body)
    //登录
    if(method === 'POST' && req.path === '/api/user/login'){
        const { username, password } = req.body
        // const { username, password } = req.query
        console.log('username', username)
        const result = login(username, password)
        return result.then(data => {
            if(data.username){
                //操纵cookie
                // res.setHeader('Set-Cookie', `username=${data.username}; path='/'; httpOnly; expires=${getCookieExpires()}`)
                //设置session
                req.session.username = data.username
                req.session.realname = data.realname
                console.log('req.session is', req.session)
                set(req.sessionId, JSON.stringify(req.session))
                return new SuccessModal()
            }else{
                return new ErrorModal('登录失败')
            }
        })
        
    }
    // //登录验证的测试
    // if(method === 'GET' && req.path === '/api/user/login-test'){
    //     console.log( '1111111', req.session)
    //     if(req.session.username){
    //         return Promise.resolve(new SuccessModal({session: req.session}))
    //     }
    //     return Promise.resolve(new ErrorModal('尚未登录'))
    // }
}

module.exports = handleUserRouter