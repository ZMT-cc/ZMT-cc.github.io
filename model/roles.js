var mongoose = require('mongoose')
var Schema = mongoose.Schema

var RoleSchema = new Schema({ name: String, remark: String, permissions: Array }, {
    timestamps: {
        createdAt: 'created',
        updatedAt: 'update'
    }
})

const Role = mongoose.model('Role', RoleSchema);
module.exports = Role