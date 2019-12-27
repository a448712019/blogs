
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')
const { get, set } = require('./src/db/redis')
const querystring = require('querystring')
const { access } = require('./src/utils/log')
//获取 cookie的过期时间
const getCookieExpires = () => {
    const d = new Date()
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
    console.log('d.toGMTString() is', d.toGMTString())
    return d.toGMTString()
}
// //session 数据
// const SESSION_DATA = {}
//用于处理 post data    
const getPostData = (req) => {
    const promise = new Promise((resolve, reject) => {
        if(req.method !== 'POST'){
            resolve({})
            return
        }
        if(req.headers['content-type'] !== 'application/json'){
            resolve({})
            return
        }
        let postData = ""
        req.on("data", thunk => {
            postData += thunk.toString()
        })
        req.on("end", () => {
            if(!postData){
                resolve({})
                return
            }
            console.log('111111', postData)
            resolve(
                JSON.parse(postData)

            )
        })
    })
    return promise
}
const serverHandle = (req, res) => {
    //设置返回格式
    access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`)
    //获取path
    const url = req.url
    req.path = url.split('?')[0]
    res.setHeader('Content-type', 'application/json')

    //解析query
    req.query = querystring.parse(url.split('?')[1])

    //解析cookie
    req.cookie = {}
    const cookieStr = req.headers.cookie || '' //k1=v1;k2=v2
    cookieStr.split(';').forEach(item => {
        if(!item){
            return
        }
        const arr = item.split('=')
        const key = arr[0].trim()
        const val = arr[1].trim()
        req.cookie[key] = val
    });

    //解析session
    // let needSetCookie = false
    // let userId = req.cookie.userid
    // if(userId){
    //     if(!SESSION_DATA[userId]){
    //         SESSION_DATA[userId] = {}
    //     }
    // }else{
    //     needSetCookie = true
    //     userId = `${Date.now()}_${Math.random()}`
    //     SESSION_DATA[userId] = {}
    // }
    // req.session = SESSION_DATA[userId]

    //解析 session 使用redis
    let needSetCookie = false
    let userId = req.cookie.userid
    console.log('userId ..... ', userId)
    if(!userId){
        needSetCookie = true
        userId = `${Date.now()}_${Math.random()}`
        //初始化session
        set(userId, JSON.stringify({}))
    }
    //获取session
    console.log('userid is', userId)
    console.log('sesstion',)
    req.sessionId = userId
    get(req.sessionId).then(sessionData => {
        // console.log('sessionData is1 ...' , JSON.parse(sessionData))
        if(sessionData == null){
            //初始化session
            set(req.sessionId, JSON.stringify({}))
            //设置 session
            req.session = {}
        }else{
            req.session = sessionData
        }
        console.log('req.session ', req.session)

        // //处理post data
        return getPostData(req)
    })
    //处理postdata
    .then(postData => {
        req.body = postData

        //处理blog路由
        const blogResult = handleBlogRouter(req, res)
        if(blogResult){
            blogResult.then(blogData => {
                if(needSetCookie){
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
                }
                res.end(
                    JSON.stringify(blogData)
                )
            })
            return
        }
        
        // const blogData = handleBlogRouter(req, res)
        // if(blogData){
        //     res.end(
        //         JSON.stringify(blogData)
        //     )
        //     return
        // }

        // const userData = handleUserRouter(req, res)
        // if(userData){
        //     res.end(
        //         JSON.stringify(userData)
        //     )
        //     return
        // }

        const userResult = handleUserRouter(req, res)
        if(userResult){
            return userResult.then(userData => {
                if(needSetCookie){
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
                }
                res.end(
                    JSON.stringify(userData)
                )
            })
        }
        //未命中 返回404
        res.writeHead(404, {'Content-type': 'text/plain'})
        res.write('404 Not Found\n')
        res.end()
    })

    
}

module.exports = serverHandle


// process.env.NODE_ENV