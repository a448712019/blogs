const mysql = require('mysql')
//创建链接
const { MYSQL_CONF } = require('../conf/db.js')

const con = mysql.createConnection(MYSQL_CONF)


//开始链接
con.connect()

//执行sql的函数

function exec(sql){
    const promise = new Promise((resolve, reject) => {
        con.query(sql, (err, result) => {
            if(err){
                reject(err)
                return
            }
            resolve(result)
        })
    })
    return promise
   
}

module.exports = {
    exec,
    escape: mysql.escape
}
