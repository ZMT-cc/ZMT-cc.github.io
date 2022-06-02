'use strict'
var Users = require('../../../model/users')
const config = require('../../../token/config')
const jwt = require('jsonwebtoken')
const userApiList = [
    {
        methods: 'post',
        path: '/getUsers',
        callBack: function (req, res, next) {
            const { token } = req.headers
            const { pagesize, pageIndex } = req.body
            const optionList = [{ $sort: { created: -1 } }]
            if (pagesize) {
                optionList.push({ $project: { _id: 0, id: '$_id', permissions: 1, user: 1, roleId: 1, roleName: 1, realName: 1, remark: 1, created: 1, phone: 1, entryDate: 1, password: 1, email: 1 } }, { $skip: (pageIndex - 1) * pagesize }, { $limit: pagesize })
            }
            if (!pagesize) {
                optionList.unshift({ $project: { _id: 0, id: '$_id', name: 1 } })
            }
            Users.aggregate(optionList,
                { 'allowDiskUse': true })
                .then((data) => {
                    Users.count({}, function (err, count) {
                        res.send({ code: 0, dataList: data || [], total: count })
                    })
                })
        }
    },
    {
        methods: 'get',
        path: '/users',
        callBack: function (req, res, next) {
            const { pagesize, pageIndex } = req.body
            const optionList = [{ $sort: { created: -1 } }]
            if (pagesize) {
                optionList.push({ $project: { _id: 0, id: '$_id', user: 1, roleId: 1, name: 1, remark: 1, entryDate: 1, created: 1 } }, { $skip: (pageIndex - 1) * pagesize }, { $limit: pagesize })
            }
            if (!pagesize) {
                optionList.unshift({ $project: { _id: 0, id: '$_id', name: 1 } })
            }
            Users.aggregate(optionList,
                { 'allowDiskUse': true })
                .then((data) => {
                    Role.count({}, function (err, count) {
                        res.send({ code: 0, dataList: data || [], total: count })
                    })
                })
        }
    },
    {
        methods: 'post',
        path: '/createUser',
        callBack: function (req, res, next) {
            Users.findOne({ user: req.body.user }, (err, data) => {
                if (!err, data) {
                    if (data) {
                        res.send({ code: 400, msg: '账号名称重复' })
                    } else {
                        res.send({ code: 500, msg: '系统内部错误' })
                    }
                    return
                }
                let newUser = new Users(req.body)
                newUser.save((err, doc) => {
                    if (!err) {
                        res.send({ code: 0, msg: '创建成功' })
                    }
                })
            })

        }
    },
    {
        methods: 'post',
        path: '/updateUser',
        callBack: function (req, res, next) {
            const { id, user } = req.body
            if (id) {
                Users.findOne({ user: user, _id: { $ne: id } }, (err, data) => {
                    if (!err, data) {
                        if (data) {
                            res.send({ code: 400, msg: '账号名称重复' })
                        } else {
                            res.send({ code: 500, msg: '系统内部错误' })
                        }
                        return
                    }
                    Users.updateOne({ _id: id }, req.body, (err, data) => {
                        if (!err && data.matchedCount) {
                            res.send({ code: 0, msg: '修改成功' })
                            return
                        } else {
                            res.send({ code: 400, msg: '修改时出错' })
                        }
                    })
                })

            } else {
                res.send({ code: 400, msg: '修改时出错' })
            }

        }
    },
    {
        methods: 'post',
        path: '/removeUsers',
        callBack: function (req, res, next) {
            const userList = req.body
            userList.forEach((item, index) => {
                Users.findById(item, (err, user) => {
                    if (!err && user) {
                        user.remove((err) => {
                            if (index === userList.length - 1) {
                                res.send({ code: 0, msg: '删除成功' })
                            }
                        })
                    }
                })
            });

        }
    },
    {
        methods: 'post',
        path: '/uploadFaceImage',
        callBack: function (req, res, next) {
            console.log(req.body)
            res.send({ code: 0 })
        }
    }
]

module.exports = function (router) {
    userApiList.forEach((api) => {
        router[api.methods](api.path, api.callBack)
    })
}