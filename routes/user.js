const router = require('koa-router')()
const { login } = require('../controller/user')
const { SuccessModal, ErrorModal } = require('../model/resModel')

router.prefix('/api/user')

router.post('/login', async function (ctx, next) {
    const { username, password } = ctx.request.body
    const data = await login(username, password)
    if(data.username){
        //操纵cookie
        // res.setHeader('Set-Cookie', `username=${data.username}; path='/'; httpOnly; expires=${getCookieExpires()}`)
        //设置session
        ctx.session.username = data.username
        ctx.session.realname = data.realname
        console.log('req.session is', ctx.session)
        ctx.body = new SuccessModal()
        return
    }
    ctx.body = new ErrorModal('登录失败')
})


router.get('/seesion-test', async (ctx, next) => {
    if(ctx.session.viewCount == null){
        ctx.session.viewCount = 0
    }
    ctx.session.viewCount++
    ctx.body = {
        errno: 0,
        viewCount:ctx.session.viewCount
    }
})

module.exports = router