var mongoose = require('mongoose')
var Schema = mongoose.Schema
var UsersSchema = new Schema({
    name: String,
    password: String,
    user: String,
    remark: String,
    realName: String,
    password: String,
    roleId: String,
    phone: String,
    email: String,
    entryDate: Date,
    roleName: String
}, {
    timestamps: {
        createdAt: 'created',
        updatedAt: 'update'
    }
})
var Users = mongoose.model('Users', UsersSchema);

module.exports = Users