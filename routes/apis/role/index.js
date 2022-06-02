
const Role = require('../../../model/roles')

/* GET users listing. */ //set DEBUG=e-commerce-office-system:* & npm start

const roleApiList = [
    {
        methods: 'post',
        path: '/createRole',
        callBack: function (req, res, next) {
            Role.findOne({ name: req.body.name }, (err, data) => {
                if (!err, data) {
                    if (data) {
                        res.send({ code: 400, msg: '角色名称重复' })
                    } else {
                        res.send({ code: 500, msg: '系统内部错误' })
                    }
                    return
                }
                let newRole = new Role(req.body)
                newRole.save((err, doc) => {
                    if (!err) {
                        res.send({ code: 0, msg: '创建成功' })
                    }
                })
            })

        }
    },
    {
        methods: 'post',
        path: '/updateRole',
        callBack: function (req, res, next) {
            const { id, name } = req.body
            if (id) {
                Role.findOne({ name: name, _id: { $ne: id } }, (err, data) => {
                    if (!err, data) {
                        if (data) {
                            res.send({ code: 400, msg: '角色名称重复' })
                        } else {
                            res.send({ code: 500, msg: '系统内部错误' })
                        }
                        return
                    }
                    Role.updateOne({ _id: id }, req.body, (err, data) => {
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
        path: '/getRole',
        callBack: function (req, res, next) {
            const { pagesize, pageIndex } = req.body
            const optionList = [{ $sort: { created: -1 } }]
            if (pagesize) {
                optionList.push({ $project: { _id: 0, id: '$_id', permissions: 1, name: 1, remark: 1, created: 1 } }, { $skip: (pageIndex - 1) * pagesize }, { $limit: pagesize })
            }
            if (!pagesize) {
                optionList.unshift({ $project: { _id: 0, id: '$_id', name: 1 } })
            }
            Role.aggregate(optionList,
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
        path: '/removeRole',
        callBack: function (req, res, next) {
            const roleList = req.body
            roleList.forEach((item, index) => {
                Role.findById(item, (err, roles) => {
                    if (!err && roles) {
                        roles.remove((err) => {
                            if (index === roleList.length - 1) {
                                res.send({ code: 0, msg: '删除成功' })
                            }
                        })
                    }
                })
            });

        }
    }
]

module.exports = function (router) {
    roleApiList.forEach((api) => {
        router[api.methods](api.path, api.callBack)
    })
}