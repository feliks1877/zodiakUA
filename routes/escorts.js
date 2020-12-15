const {Router} = require('express')
const City = require('../models/city')
const Objects = require('../models/objects')
const Review = require('../models/review')
const meta = require('../headers/meta')
const Meta = require('../models/meta')
const Func = require('../function/func')
const {validationResult} = require('express-validator')
const {editValidation} = require('../utils/validator')
const savePhoto = require('../function/savePhoto')
const router = Router()

router.get('/escort', async (req, res) => {
    const user = req.session.user
    const city = await City.getAll()
    const objects = []
    const arr = await Objects.find().where({active: 1}).sort({date: 'desc'}).populate('userId')
    await Func.filBalance(arr, objects)
    const page = await Func.pagination(arr)
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
        await Func.filBalance(arr, objects)
        const page = await Func.pagination(amount)
        await res.render('escort', {
            title: 'Escort',
            meta: meta.contentEscort,
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
        Func.filBalance(c, object)
        if (cityes.name) {
            const page = Func.pagination(c)
            let cityMph = Meta.morph(cityes.name)
            res.render('city', {
                title: `Эскорт ${cityes.name}`,
                headCity: `${cityMph}`,
                meta: `${meta.cityMeta} ${cityMph} ${meta.cityMeta2} ${cityMph}`,
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
        .skip(pageNumber > 0 ? ((pageNumber - 1) * 50) : 0).limit(50).populate('userId')
    const page = Func.pagination(arr)
    let cityMph = Meta.morph(cityes.name)
    res.render('city', {
        title: `Эскорт ${cityes.name}`,
        headCity: `${cityMph}`,
        meta: `${meta.cityMeta} ${cityMph} ${meta.cityMeta2} ${cityMph}`,
        object, cityes, city, user, page
    })
})

router.get('/id/:id', async (req, res) => {
    const object = await Objects.findById(req.params.id).where({active: 1})
    // noinspection JSUnresolvedFunction
    const city = await City.getAll()
    const review = await Review.find({objectId: req.params.id})
    const user = req.session.user
    const s = new Date()
    const rcm = await Objects.find({rcm: {$gte: s.setDate(s.getDate() - 1)}}).limit(4)
    await res.render('model', {
        title: `Model ${object.name}`,
        meta: object.description,
        object, review, rcm, user, city
    })
})

router.get('/:id/edit', async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/escort')
    } else {
        const city = await City.getAll()
        const object = await Objects.findById(req.params.id)
        res.render('edit', {
            title: 'Редактирование',
            object,city
        })
    }
})


router.post('/edit',  editValidation ,async (req, res) => {
    try {
        const err = validationResult(req)
        console.log(err)
        if(!err.isEmpty()){
            // noinspection JSUnresolvedFunction
            req.flash('message', err.array()[0].msg)
            return res.status(422).redirect('/lk')
        }
        // noinspection JSUnresolvedVariable
        console.log(req.files)
        // noinspection JSUnresolvedVariable
        if(req.files.length) {
            // noinspection JSUnresolvedVariable
            console.log('REQ',req.body)
            // noinspection JSUnresolvedVariable
            req.files.forEach((el) => {
                req.body.photo.unshift(el.filename)
                new Promise((resolve, reject) => {
                    const data = savePhoto(el)
                    if (data === true) {
                        resolve(data)
                    } else {
                        // noinspection JSUnresolvedFunction
                        req.flash('error', 'Что то пошло не так, попробуйте позже')
                        res.redirect('/lk')
                        reject(false)
                    }
                }).then(data => {
                    console.log('Save photo', data)
                })
            })
        }
        await req.body.photo.forEach((e, i) => {
            if (e.length <= 0) {
                req.body.photo.splice(i, 1)
            }
        })
        await Objects.findByIdAndUpdate(req.body.id, req.body)
        // noinspection JSUnresolvedFunction
        req.flash('message', 'Объявление успешно отредактировано')
        res.redirect('/lk')
    } catch (e) {
        // noinspection JSUnresolvedFunction
        req.flash('message', 'Ошибка редактирования, повторите попытку позже')
        console.log('Редактирование', e)
        res.redirect('/lk')
    }
})
module.exports = router