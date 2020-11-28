const {Schema, model} = require('mongoose')
const object = new Schema({
    city: {
        type: String,
        required: true
    },
    type: String,
    address: String,
    name: String,
    paramModel: Array,
    bdsm: Array,
    phone: Array,
    price: [Number],
    photo: {
        type:Array,
        required: true
    },
    description: String,
    classik: Array,
    massage: Array,
    other: Array,
    appraisal: Number,
    veryfication: Number,
    active: Number,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    autoTop: String,
    rcm: Date,
    date: Date
})
module.exports = model('Object', object)















// const uuid = require('uuid').v4
// const fs = require('fs')
// const path = require('path')
// class Object {
//     static async getByObjCity(city) {
//         console.log(Object.find())
        //     const objects = await Object.find()
        //     const arrObj = []
        //     objects.forEach((e) => {
        //         if (e.city === city) {
        //             arrObj.push(e)
        //         }
        //     })
        //     return arrObj
//     }
// }
//             this.type = type,
//             this.name = name,
//             this.paramModel = paramModel,
//             this.bdsm = bdsm,
//             this.phone = phone,
//             this.price = price,
//             this.photo = photo,
//             this.description = description,
//             this.classik = classik,
//             this.massage = massage,
//             this.other = other,
//             this.appraisal = appraisal,
//             this.date = Date.now(),
//             this.id = uuid()


// const uuid = require('uuid').v4
// const fs = require('fs')
// const path = require('path')
// // const dateUs = {
// //     year: 'numeric',
// //     month: 'numeric',
// //     day: 'numeric',
// //     hour: 'numeric',
// //     minute: 'numeric',
// //     timeZone: 'UTC'
// // }
// function srt(a,b){
//     return a - b
// }
//
//
// class Object {
//     constructor(city,type, name, paramModel, bdsm, phone, price, photo, description, classik, massage, other, appraisal) {
//         this.city = city,
//             this.type = type,
//             this.name = name,
//             this.paramModel = paramModel,
//             this.bdsm = bdsm,
//             this.phone = phone,
//             this.price = price,
//             this.photo = photo,
//             this.description = description,
//             this.classik = classik,
//             this.massage = massage,
//             this.other = other,
//             this.appraisal = appraisal,
//             this.date = Date.now(),
//             this.id = uuid()
//     }
//
//     toJSON() {
//         return {
//             city: this.city,
//             type: this.type,
//             name: this.name,
//             paramModel: this.paramModel,
//             bdsm: this.bdsm,
//             phone: this.phone,
//             price: this.price,
//             photo: this.photo,
//             description: this.description,
//             classik: this.classik,
//             massage: this.massage,
//             other: this.other,
//             appraisal: this. appraisal,
//             date: this.date,
//             id: this.id
//         }
//     }
//
//     async save() {
//         const objects = await Object.getAllObjects()
//         objects.push(this.toJSON())
//
//         return new Promise((resolve, reject) => {
//             fs.writeFile(
//                 path.join(__dirname, '..', 'data', 'objects.json'),
//                 JSON.stringify(objects),
//                 (err) => {
//                     if (err) {
//                         reject(err)
//                     } else {
//                         resolve()
//                     }
//                 }
//             )
//
//         })
//
//     }
//
//     static getAllObjects() {
//         return new Promise((resolve, reject) => {
//             fs.readFile(
//                 path.join(__dirname, '..', 'data', 'objects.json'),
//                 'utf-8',
//                 (err, content) => {
//                     if (err) {
//                         reject(err)
//                     } else {
//                         resolve(JSON.parse(content))
//                     }
//                 }
//             )
//         })
//
//     }
//
//     static async getByObjCity(city) {
//         const objects = await Object.getAllObjects()
//         const arrObj = []
//         objects.forEach((e) => {
//             if (e.city === city) {
//                 arrObj.push(e)
//             }
//         })
//         return arrObj
//     }
//
//     static async getById(id) {
//         const objects = await Object.getAllObjects()
//         return objects.find(c => c.id === id)
//     }
//
//     static async update(object) {
//         const objects = await Object.getAllObjects()
//         const idx = objects.findIndex(c => c.id === object.id)
//         objects[idx] = object
//         console.log(objects[idx])
//         return new Promise((resolve, reject) => {
//             fs.writeFile(
//                 path.join(__dirname, '..', 'data', 'objects.json'),
//                 JSON.stringify(objects),
//                 (err) => {
//                     if (err) {
//                         reject(err)
//                     } else {
//                         resolve()
//                     }
//                 }
//             )
//
//         })
//     }
// }
//
// module.exports = Object