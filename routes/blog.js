var express = require('express');
var router = express.Router();
const { getList, getDetail, newBlog, updateBlog, delBlog } = require('../controller/blog')
const { SuccessModal, ErrorModal } = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')

router.get('/list', (req, res, next) => {
    let author = req.query.author || ''
    let keyword = req.query.keyword || ''
    if(req.query.isadmin){
        console.log('is admin ')
        if(req.session.username == null){
            res.json(
                new ErrorModal('未登录')
            )
            return
        }
        author = req.session.username
    }
    console.log('list session', req.session)
    const result = getList(author, keyword)
    return result.then(listData => {
        res.json(new SuccessModal(listData))
    })
})
router.get('/detail',  (req, res, next) => {
    const result = getDetail(req.query.id)
    return result.then(data => {
        res.json(
            new SuccessModal(data)
        )
    })
})
router.post('/new', loginCheck ,(req, res, next) => {
    req.body.author = req.session.username
    const result = newBlog(req.body)
    return result.then(data => {
        res.json(
            new SuccessModal(data)
        )
    })
})
router.post('/update', loginCheck, (req, res, next) => {
    const result = updateBlog(req.query.id, req.body)
    return result.then(val => {
        if(val){
            res.json(
                new SuccessModal()
            )
        } else {
            res.json(
                new ErrorModal('更新博客失败')
            )
        }
    })
})
router.post('/del', loginCheck, (req, res, next) => {
    const author = req.session.username
    const result = delBlog(req.query.id, author)
    return result.then(val => {
        if(val){
            res.json(
                new SuccessModal()
            )
        } else {
            res.json(
                new ErrorModal('删除博客失败')
            )
        }
    })
})
module.exports = router