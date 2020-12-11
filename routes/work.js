const {Router} = require('express')
const City = require('../models/city')
const workObj = require('../models/workObj')
const savePhoto = require('../function/savePhoto')
const Country = require('../models/country')
const router = Router()

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

function timeConvert(obj) {
    obj.forEach(el => {
        let time = ((new Date().getTime() - el.date.getTime()) / 3600000)
        if (time < 24) {
            let t = Math.round(time)
            let s = (t === 0) ? 'Сегодня' : (t === 1 || t === 21) ? `${t} час назад` :
                (t >= 2 && t <= 4 || t >= 22)
                    ? `${t} часа назад` : (t >= 5 && t <= 20) ?
                        `${t} часов назад` :  null
            el.description.push(s)
        } else {
            const days = Math.round(time / 24)
            const ti = (days <= 1) ? 'Сегодня' : (days <= 4) ?
                `${days} дня назад` : (days >= 5 && days < 21) ?
                    `${days} дней назад` : (days >= 22 && days < 25) ? `${days} дня назад` :
                        (days >= 25 && days <= 30) ? `${days} дней назад` : `Давно`
            el.description.push(ti)
        }
    })
}


router.get('/work', async (req, res) => {
    const user = req.session.user
    let arr = await workObj.find().where({active: 1}).sort({date: 'desc'}).populate('userId')
    let objects = []
    const city = await City.getAll()
    const page = await pagination(arr)
    await filBalance(arr, objects)
    await objects.forEach(el => {
        el.description[0] = el.description[0].substring(0, 150)
    })
    await timeConvert(objects)
    res.render('work', {
        title: 'Вакансии',
        city, page, objects, user
    })

})

router.get('/work/id/:id', async (req, res) => {
    const object = await workObj.findById(req.params.id)
    let o = []
    o.push(object)
    await timeConvert(o)
    res.render('workId', {
        title: `Вакансия ${object.podtype}`,
        object
    })
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