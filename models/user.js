const {Schema, model} = require('mongoose')
const user = new Schema({
    login: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
       type: String,
       required: true
    },
    resetToken: String,
    resetTokenExp: Date,
    key: Number,
    balance: Number
})
module.exports = model('User', user)