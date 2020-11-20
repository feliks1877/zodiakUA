const {Schema,model} = require('mongoose')

const pay = new Schema({
    pay: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    object: {
      type: Schema.Types.ObjectId,
      ref: 'Object'
    },
    date: Date
})

module.exports = model('Pay', pay)

