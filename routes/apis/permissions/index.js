var mongoose = require('mongoose')
const Permissions = mongoose.model('Permissions', { title: String, key: String, path: String, icon: String, children: { type: Array, default: [] } });
const config = require('../../../token/config')
const jwt = require('jsonwebtoken')
var Users = require('../../../model/users')
const Role = require('../../../model/roles')
const permissionsList = [
    {
        methods: 'get',
        path: '/getPermissions',
        callBack: function (req, res, next) {
            const { token } = req.headers
            try {
                const userInfo = jwt.decode(token)
                Users.findOne({ _id: userInfo.id }, (err, duc) => {
                    if (!err) {
                        Role.findOne({ _id: duc.roleId }, (err, roleDuc) => {
                            if (!err) {
                                const permissionsKeyList = roleDuc.permissions
                                Permissions.aggregate([{ $project: { _id: 0 } }]).then((dataList) => {
                                    const menuList = []
                                    dataList.forEach((item) => {
                                        if (permissionsKeyList.includes(item.key)) {
                                            menuList.push(item)
                                        }
                                    })
                                    res.send({ code: 0, menuList, userInfo, permissionsKeyList })
                                })
                            }
                        })
                    }
                })
            } catch (err) {
                res.send({ code: 403, msg: err })
            }

        }
    },
    {
        methods: 'get',
        path: '/getPermissionList',
        callBack: function (req, res, next) {
            Permissions.aggregate([{ $project: { _id: 0 } }]).then((permissionList) => {
                res.send({ code: 0, permissionList })
            })
        }
    }
]

module.exports = function (router) {
    permissionsList.forEach((api) => {
        router[api.methods](api.path, api.callBack)
    })
}