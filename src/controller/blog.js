const { exec } = require('../db/mysql.js')
const xss = require('xss')
const getList = (author, keyword) => {
    let sql = 'select * from blogs where 1=1 '
    if(author){
        sql += `and author='${author}' `
    }
    if(keyword){
        sql += `and title like '%${keyword}%' `
    }

    sql += `order by createtime desc;`

    return exec(sql)
}

const getDetail = (id) => {
    const sql = `select * from blogs where id=${id}`
    return exec(sql).then(rows => {
        return rows[0]
    })
}

const updateBlog = (id, blogData = {}) => {
    console.log('update blog', id, blogData)
    const title = xss(blogData.title)
    const content = blogData.content

    const sql =  `
        update blogs set title='${title}', content='${content}' where id=${id}
    `

    return exec(sql).then(updateData => {
        console.log('updateData is', updateData)
        if(updateData.affectedRows > 0){
            return true
        }
        return false
    })
    // return true
}

const newBlog = (blogData = {}) => {
    console.log('blogData...', blogData)
    // blogData是一个博客对象 包含title content 属性
    const title = blogData.title
    const content = blogData.content
    const author = blogData.author
    const createtime = Date.now()
    const sql = `
        insert into blogs (title, content, createtime, author)
        values ('${title}', '${content}', '${createtime}', '${author}');
    `
    return exec(sql).then(insertData => {
        console.log('insertData is', insertData)
        return {
            id: insertData.insertId
        }
    })
}

const delBlog = (id, author) => {
    const sql = `
        delete from blogs where id='${id}' and author='${author}'
    `
    return exec(sql).then(delData => {
        console.log('delData is', delData)
        if(delData.affectedRows > 0){
            return true
        }
        return false
    })
}
module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}