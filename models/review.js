const {Schema, model} = require('mongoose')
const uuid = require('uuid').v4
const fs = require('fs')
const path = require('path')
const Objects = require('../models/objects')

const review = new Schema({
    login: String,
    disc: Array,
    photoRev: String,
    very: String,
    review: String,
    objectId: {
        type: Schema.Types.ObjectId,
        ref: 'Object'
    }
})

module.exports = model('Review', review)
// class Review {
//     constructor(_id, disc, photoRev, very, review) {
//             this._id = _id,
//             this.disc = disc,
//             this.photoRev = photoRev,
//             this.very = very,
//             this.review = review,
//             this.id = uuid(),
//             this.date = new Date()
//     }
//
//     toJSON() {
//         return {
//             _id: this._id,
//             disc: this.disc,
//             photoRev: this.photoRev,
//             very: this.very,
//             review: this.review,
//             id: this.id,
//             date: this.date
//         }
//     }
//
//     async save() {
//         const objects = await Review.getAllReviews()
//
//         objects.push(this.toJSON())
//         const obj = this.toJSON()
//         await Review.updAppraisal(obj._id)
//         return new Promise((resolve, reject) => {
//             fs.writeFile(
//                 path.join(__dirname, '..', 'data', 'review.json'),
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
//     static getAllReviews() {
//         return new Promise((resolve, reject) => {
//             fs.readFile(
//                 path.join(__dirname, '..', 'data', 'review.json'),
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
//     static async updAppraisal(id){
//         const review = await Review.getAllReviews()
//         const obj = await Objects.findById(id)
//         const arrReview = []
//         const s = []
//         review.forEach((c) => {
//             if (c._id === id) {
//                 arrReview.push(c)
//                 s.push(parseInt(c.very))
//             }
//         })
//         if(s.length > 0) {
//             const total = s.reduce(function (a, b) {
//                 return a + b
//             }) / arrReview.length
//             arrReview.push(total.toFixed(1))
//         }
//         obj.appraisal = arrReview.pop()
//         await Objects.update(obj)
//         return arrReview
//     }
//
//     static async getByReviewsId(id) {
//         const review = await Review.getAllReviews()
//         const arrReview = []
//         review.forEach((c) => {
//             if (c._id === id) {
//                 arrReview.push(c)
//             }
//         })
//         return arrReview
//     }
// }
//
