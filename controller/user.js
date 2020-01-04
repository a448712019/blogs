const { exec, escape } = require('../db/mysql.js')
const { genPassword } = require('../utils/cryp')
const login = async (username, password) => {
    console.log(username, password)
    username = escape(username)


    password = genPassword(password)
    password = escape(password)

    //生成加密密码
    const sql = `
        select username, realname from users where username=${username} and password=${password}
    `
    const rows = await exec(sql)
    return rows[0] || {}
}

module.exports = {
    login
}