const fs = require('fs');
const {Router} = require('express')
const City = require('../models/city')
const Objects = require('../models/objects')
const Review = require('../models/review')
const meta = require('../headers/meta')
// const aws = require('aws-sdk')
// const Jimp = require('jimp')
const savePhoto = require('../function/savePhoto')
// const keys = require('../keys')
const router = Router()
// aws.config.update({
//     "accessKeyId": keys.AWS_ACCESS_KEY_ID,
//     "secretAccessKey": keys.AWS_SECRET_ACCESS_KEY,
//     "region": 'us-east-2'
// });
// let s3 = new aws.S3({
//     apiVersion: "2006-03-01",
//     params: {Bucket: keys.S3_BUCKET}
// })

function filBalance(arr, ob) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].userId.balance > 0) {
            ob.push(arr[i])
        }
    }
}

function pagination(arr) {
    const p = arr.length / 50
    const page = []
    for (let i = 0; i < p; i++) {
        page.push(i + 1)
    }
    return page
}

router.get('/escort', async (req, res) => {
    const user = req.session.user
    const city = await City.getAll()
    const objects = []
    const arr = await Objects.find().where({active: 1}).sort({date: 'desc'}).populate('userId')
    await filBalance(arr, objects)
    const page = await pagination(arr)
    await res.render('escort', {
        title: meta.titleEscort,
        meta: meta.contentEscort,
        objects, city, user, page
    })
})

router.get('/page/:page', async (req, res) => {
    try {

        const city = await City.getAll()
        const user = req.session.user
        const objects = []
        const pageNumber = req.params.page
        const arr = await Objects.find().where({active: 1}).sort({date: 'desc'})
            .skip(pageNumber > 0 ? ((pageNumber - 1) * 50) : 0).limit(50).populate('userId')
        const amount = await Objects.find().where({active: 1})
        await filBalance(arr, objects)
        const page = await pagination(amount)
        await res.render('escort', {
            title: 'Escort',
            objects, city, user, page
        })
    } catch (e) {
        console.log('ERROR ESCORT PAGE', e)
    }

})

router.get('/escort/:name', async (req, res) => {
    const object = []
    const user = req.session.user
    const cityes = await City.getByCity(req.params.name)
    const city = await City.getAll()
    new Promise((resolve) => {
        const c = Objects.find({active: 1})
            .where('city')
            .equals(req.params.name)
            .sort({date: 'desc'})
            .populate('userId')
        resolve(c)
    }).then((c) => {
        filBalance(c, object)
        if (cityes.name) {
            const page = pagination(c)
            res.render('city', {
                title: `Эскорт ${cityes.name}`,
                headCity: `${cityes.name}`,
                meta: `${meta.cityMeta} ${cityes.name} ${meta.cityMeta2}`,
                cityes, object, city, user, page
            })
        }
    }).catch(err => console.log(err))
})

router.get('/city/:name/page/:page', async (req, res) => {
    const cityes = await City.getByCity(req.params.name)
    const city = await City.getAll()
    const user = req.session.user
    const pageNumber = req.params.page
    const arr = await Objects.find({active: 1}).where('city').equals(req.params.name)
    const object = await Objects.find({active: 1}).where('city').equals(req.params.name).sort({date: 'desc'})
        .skip(pageNumber > 0 ? ((pageNumber - 1) * 50) : 0).limit(50).populate('userId').populate('userId')
    const page = pagination(arr)
    res.render('city', {
        title: `Эскорт ${cityes.name}`,
        headCity: `${cityes.name}`,
        meta: `${cityes.name}`,
        object, cityes, city, user, page
    })
})

router.get('/id/:id', async (req, res) => {
    const object = await Objects.findById(req.params.id).where({active: 1})
    const review = await Review.find({objectId: req.params.id})
    const user = req.session.user
    const s = new Date()
    const rcm = await Objects.find({rcm: {$gte: s.setDate(s.getDate() - 1)}}).limit(4)
    console.log(object.name)
    await res.render('model', {
        title: `Model ${object.name}`,
        object, review, rcm, user
    })
})

router.get('/:id/edit', async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/escort')
    } else {
        const object = await Objects.findById(req.params.id)
        res.render('edit', {
            title: 'Редактирование',
            object
        })
    }
})



router.post('/edit', async (req, res) => {
    try {
        if (req.files.length) {

            req.files.forEach((el) => {
                req.body.photo.unshift(el.filename)
                savePhoto(el)
            })
            await req.body.photo.forEach((e) => {
                if (!e.length) {
                    req.body.photo.pop()
                }
            })
        }

        await Objects.findByIdAndUpdate(req.body.id, req.body)
        await res.redirect('/lk')
    } catch (e) {
        console.log('Редактирование', e)
        res.redirect('/lk')
    }
})
module.exports = router