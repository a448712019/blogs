const redis = require('redis')
const { REDIS_CONF } = require('../conf/db.js')

//创建redis客户端
const redisClient = redis.createClient(6379, '127.0.0.1')

redisClient.on('error', err => {
    console.log(err)
})

function set(key, val){
    if(val === 'object'){
        val = JSON.stringify(val)
    }
    redisClient.set(key, val, redis.print)
}

function get(key){
    const promise = new Promise((resolve, reject) => {
        redisClient.get(key, (err, val) => {
            if(err){
                reject(err)
                return
            }
            console.log(val)
            if(val == null){
                resolve(null)
                return
            }
            try {
                resolve(
                    JSON.parse(val)
                )
            } catch (ex) {
                resolve(val)
            }
            
        })
    })
    return promise
}

module.exports = {
    set,
    get
}