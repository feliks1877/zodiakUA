const {Schema, model} = require('mongoose')

const WorkObj = new Schema({
    type: String,
    podtype: String,
    country: String,
    city: String,
    photo: Array,
    description: Array,
    phone: Array,
    active: Number,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    autoTop: String,
    rcm: Date,
    date: Date,
})

module.exports = model('WorkObj', WorkObj)