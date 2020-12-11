const {Router} = require('express')
const City = require('../models/city')
const workObj = require('../models/workObj')
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
                (t >= 2 && t <= 4 || t < 22)
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
module.exports = router