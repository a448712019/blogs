const router = require('koa-router')()
const { getList, getDetail, newBlog, updateBlog, delBlog } = require('../controller/blog')
const { SuccessModal, ErrorModal } = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')

router.prefix('/api/blog')

router.get('/list', async function (ctx, next) {
    let author = ctx.query.author || ''
    let keyword = ctx.query.keyword || ''
    if(ctx.query.isadmin){
        console.log('is admin ')
        if(ctx.session.username == null){
            ctx.body = new ErrorModal('未登录')
            return
        }
        author = ctx.session.username
    }
    const listData = await getList(author, keyword)
    return ctx.body = new SuccessModal(listData)
})

router.get('/detail', async (ctx, next) => {
    const data = await getDetail(ctx.query.id)
    ctx.body = new SuccessModal(data)
})
router.post('/new',loginCheck, async (ctx, next) => {
    const body = ctx.request.body
    body.author = ctx.session.username
    const data = await newBlog(body)
    ctx.body = new SuccessModal(data)
})
router.post('/update',loginCheck, async (ctx, next) => {
    const val = await updateBlog(ctx.query.id, ctx.request.body)
    if(val){
        ctx.body = new SuccessModal()
    } else {
        ctx.body = new ErrorModal('更新博客失败')
    }
})
router.post('/del', loginCheck,async (ctx, next) => {
    const author = ctx.session.username
    const val = await delBlog(ctx.query.id, author)
    if(val){
        ctx.body = new SuccessModal()
    } else {
        ctx.body = new ErrorModal('删除博客失败')
    }
})

module.exports = router
