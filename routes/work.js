const {Router} = require('express')
const City = require('../models/city')
const workObj = require('../models/workObj')
const User = require('../models/user')
const Pay = require('../models/pay')
const savePhoto = require('../function/savePhoto')
const {validationResult} = require('express-validator')
const {workEditValidators} = require('../utils/validator')
const Func = require('../function/func')
const meta = require('../headers/meta')
const Country = require('../models/country')
const router = Router()

function payAdd(pay, userId, object) {
    return new Pay({
        pay: pay,
        userId: userId,
        object: object,
        date: new Date()
    })
}

router.get('/work', async (req, res) => {
    const user = req.session.user
    let arr = await workObj.find().where({active: 1}).sort({date: 'desc'}).populate('userId')
    let objects = []
    const city = await City.getAll()
    const page = await Func.pagination(arr)
    await Func.filBalance(arr, objects)
    await objects.forEach(el => {
        el.description[0] = el.description[0].substring(0, 150)
    })
    await Func.timeConvert(objects)
    res.render('work', {
        title: 'Вакансии',
        meta: meta.workMeta,
        city, page, objects, user
    })

})

router.get('/work/id/:id', async (req, res) => {
    const object = await workObj.findById(req.params.id)
    let o = []
    o.push(object)
    await Func.timeConvert(o)
    res.render('workId', {
        title: `Вакансия ${object.podtype}`,
        meta: `${object.description[0]}`,
        object
    })
})

router.get('/work/page/:page', async (req, res) => {
    try {
        const city = await City.getAll()
        const user = req.session.user
        const pageNumber = req.params.page
        const objects = await workObj.find().where({active: 1}).sort({date: 'desc'})
            .skip(pageNumber > 0 ? ((pageNumber - 1) * 50) : 0).limit(50).populate('userId')
        await objects.forEach(el => {
            el.description[0] = el.description[0].substring(0, 150)
        })
        const page = await Func.pagination(objects)
        await Func.timeConvert(objects)
        await res.render('work', {
            title: `Вакансии`,
            meta: meta.workMeta,
            objects, city, user, page
        })
    } catch (e) {
        console.log('ERROR WORK PAGE', e)
    }

})
router.get('/workactive/:id', async (req, res) => {
    console.log(req.params.id, req.query.active)
    await workObj.updateOne({_id: req.params.id}, {active: req.query.active})
    await res.redirect('/lk')
})

router.get('/worktop/:id/lk', async (req, res) => {
    const obj = await workObj.findByIdAndUpdate({_id: req.params.id}, {date: new Date()})
    const user = await User.findById({_id: req.session.user._id})
    const balance = user.balance - 15
    await User.updateOne({_id: req.session.user._id}, {balance: balance})
    const pay = payAdd(`Платеж за поднятие вакансии -15 UAH.`,req.session.user._id,obj.id,)
    await pay.save()
    res.redirect('/lk')
})

router.get('/workrcm/:rcm', async (req, res) => {
    try {
        await workObj.findByIdAndUpdate({_id: req.params.rcm}, {rcm: new Date()}).populate('userId')
        const user = await User.findById({_id: req.session.user._id})
        const balance = user.balance - 30
        await User.updateOne({_id: req.session.user._id}, {balance: balance})
        const pay = payAdd(`Платеж за добавление в рекомендуемые вакансии -30UAH`, req.session.user._id)
        await pay.save()
        res.send('GOOD')
    } catch (e) {
        console.log('ERROR R E C O M E N D A T I O N  WORK', e)
    }
})


router.get('/:id/editwork', async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/escort')
    } else {
        let country = await Country.getAll()
        const object = await workObj.findById(req.params.id)
        res.render('editwork', {
            title: 'Редактирование',
            object, country
        })
    }
})
router.post('/editwork', workEditValidators, async (req, res) => {
    try {
        // console.log(req.body)
        const err = validationResult(req)
        // noinspection SpellCheckingInspection
        console.log('ERR VALID WORKEDIT',err)
        if(!err.isEmpty()){
            // noinspection JSUnresolvedFunction
            req.flash('message', err.array()[0].msg)
            return res.status(422).redirect('/lk')
        }
        // noinspection JSUnresolvedVariable
        if (req.files.length) {
            // noinspection JSUnresolvedVariable
            req.files.forEach((el) => {
                console.log('EL',el.filename)
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
        console.log('REQ',req.body.photo)
        await req.body.photo.forEach((e, i) => {
            console.log('EL',e)
            if (e.length <= 0) {
                req.body.photo.splice(i, 1)
            }
        })

        console.log('PHOTO',req.body.photo)
        await workObj.findByIdAndUpdate(req.body.id, req.body)
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