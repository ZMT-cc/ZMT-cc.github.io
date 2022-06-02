var mongoose = require('mongoose')
var Users = require('../../../model/users')

const config = require('../../../token/config')
const jwt = require('jsonwebtoken')


const loginApiList = [
    {
        methods: 'post',
        path: '/login',
        callBack: function (req, res, next) {
            let { username, password } = req.body
            if (username && password) {
                Users.findOne({ user: username, password: password }, 'id user realName', (err, doc) => {
                    if (!err && doc) {
                        const data = {
                            ...doc.toObject()
                        }
                        data.id = data._id
                        delete data._id
                        const tokenStr = jwt.sign(data, config.jwtSecretKey, {
                            expiresIn: '10h', // token 有效期为 10 个小时
                        })
                        res.send({ code: 0, userInfo: data, token: tokenStr })
                    } else {
                        res.send(JSON.stringify({ code: 400, msg: '账号密码错误' }))
                    }
                })
            } else {
                res.send(JSON.stringify({ code: 400, msg: '请输入账号或密码' }))
            }
        }
    },
    {
        methods: 'post',
        path: '/unlock',
        callBack: function (req, res, next) {
            res.send(JSON.stringify({ code: 0, msg: '成功' }))
        }
    },
]


module.exports = function (router) {
    loginApiList.forEach((api) => {
        router[api.methods](api.path, api.callBack)
    })
}
