const { getList, getDetail, newBlog, updateBlog, delBlog } = require('../controller/blog')
const { SuccessModal, ErrorModal } = require('../model/resModel')


//登录验证
const loginCheck = (req) => {
    console.log('logincheck', req.session)
    if(!req.session.username){
        return Promise.resolve(new ErrorModal('尚未登录'))
    }
    
}

const handleBlogRouter = (req, res) => {
    const method = req.method
    const id = req.query.id;
    //获取博客列表
    if(method === 'GET' && req.path === '/api/blog/list'){
        let author = req.query.author || ''
        let keyword = req.query.keyword || ''
        // const listData = getList(author, keyword)
        // return new SuccessModal(listData)
        console.log('req.query....', req.query.isadmin)
        if(req.query.isadmin){
            const loginCheckResult = loginCheck(req)
            if(loginCheckResult){
                return loginCheckResult
            }
            author = req.session.username
        }
        console.log('list session', req.session)
        const result = getList(author, keyword)
        return result.then(listData => {
            return new SuccessModal(listData)
        })
    }
    //获取博客详情
    if(method === 'GET' && req.path === '/api/blog/detail'){
        // const data = getDetail(id)
        // return new SuccessModal(data)
        const result = getDetail(id)
        return result.then(data => {
            return new SuccessModal(data)
        })
    }
    //新建博客
    if(method === 'POST' && req.path === '/api/blog/new'){
        // const blogData = req.body
        // const data = newBlog(req.body)
        // return new SuccessModal(data)

        const loginCheckResult = loginCheck(req)
        if(loginCheckResult){
            return loginCheckResult
        }
        req.body.author = req.session.username

        const result = newBlog(req.body)
        return result.then(data => {
            return new SuccessModal(data)
        })
        
    }
    //更新博客
    if(method === 'POST' && req.path === '/api/blog/update'){ 
        const loginCheckResult = loginCheck(req)
        if(loginCheckResult){
            return loginCheck
        }
        const result = updateBlog(id, req.body)
        return result.then(val => {
            if(val){
                return new SuccessModal()
            } else {
                return new ErrorModal('更新博客失败')
            }
        })
        
    }

    //删除博客
    if(method === 'POST' && req.path === '/api/blog/del'){
        const loginCheckResult = loginCheck(req)
        if(loginCheckResult){
            return loginCheckResult
        }
        const author = req.session.username
        const result = delBlog(id, author)
        return result.then(val => {
            if(val){
                return new SuccessModal()
            } else {
                return new ErrorModal('删除博客失败')
            }
        })
        
    }
}

module.exports = handleBlogRouter