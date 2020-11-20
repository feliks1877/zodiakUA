const Objects = require('../models/objects')
module.exports = function fil(filter,page) {
    if (filter === `desc`) {
        const obj = Objects.aggregate([
            {$match: {active: 1}},
            {$sort: {'price.0': 1}},
            {$skip: (page > 0 ? ((page - 1) * 6) : 0)},
            {$limit: 6}
        ])
        return obj
    } else if (filter === `asc`) {
        const obj = Objects.aggregate([
            {$match: {active: 1}},
            {$sort: {'price.0': -1}},
            {$skip: (page > 0 ? ((page - 1) * 6) : 0)},
            {$limit: 6}
        ])
        return obj
    } else if (filter === `reiting`) {
        const obj = Objects.aggregate([
            {$match: {active: 1}},
            {$sort: {'appraisal': -1}},
            {$skip: (page > 0 ? ((page - 1) * 6) : 0)},
            {$limit: 6}
        ])
        return obj
    }else if(filter === `very`){
        const obj = Objects.aggregate([
            {$match: {active : 1}},
            {$match: {veryfication: 1}},
            {$skip: (page > 0 ? ((page - 1) * 6) : 0)},
            {$limit: 6}
        ])
        return obj
    }
}