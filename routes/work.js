const {Router} = require('express')
const City = require('../models/city')
const workObj = require('../models/workObj')
const savePhoto = require('../function/savePhoto')
const Func = require('../function/func')
const Country = require('../models/country')
const router = Router()


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
            objects,city,user,page
        })
    } catch (e) {
        console.log('ERROR WORK PAGE', e)
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
            object,country
        })
    }
})
router.post('/editwork', async (req, res) => {
    try {
        console.log(req.body)
        if (req.files.length) {
            req.files.forEach((el) => {
                req.body.photo.unshift(el.filename)
                new Promise((resolve, reject) => {
                    const data = savePhoto(el)
                    if (data === true) {
                        resolve(data)
                    } else {
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

        console.log(req.body.photo)
        await workObj.findByIdAndUpdate(req.body.id, req.body)
        req.flash('message', 'Объявление успешно отредактировано')
        res.redirect('/lk')
    } catch (e) {
        req.flash('message', 'Ошибка редактирования, повторите попытку позже')
        console.log('Редактирование', e)
        res.redirect('/lk')
    }
})
module.exports = router