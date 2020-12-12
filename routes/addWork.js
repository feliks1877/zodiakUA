const {Router} = require('express')
const Country = require('../models/country')
const savePhoto = require('../function/savePhoto')
const WorkObj = require('../models/workObj')
const User = require('../models/user')
const Pay = require('../models/pay')
const keys = require('../keys')
const countryJSON = require('../data/country.json')
const router = Router()


function payAdd(pay,userId,object){
    return new Pay({
        pay: pay,
        userId: userId,
        object: object,
        date: new Date()
    })
}

router.get('/add/workadd', async ( req,res) => {
    let c = await Country.getAll()
    let country = []
    Object.keys(c).forEach(key => {
        country.push(c[key])
    })
    await country.sort()
    await res.render('addWork', {
        title: 'Добавить объявление',
        country
    })
})
router.post('/add/workadd', async (req,res) => {
    console.log('REQBODY',req.body.podtype)
    const userId = req.session.user._id
    const path = []
    console.log(req.files)
    await req.files.forEach((el) => {
        path.push(el.filename)
    })
    const workObj = new WorkObj({
        type: req.body.type,
        podtype: req.body.podtype,
        country: req.body.country,
        city: req.body.city,
        description: req.body.description,
        photo: path,
        phone: req.body.phone,
        active: 1,
        userId: userId,
        autoTop: '',
        rcm: new Date(),
        date: new Date()
    })
    await workObj.save()
    const user = await User.findById(userId)
    const balance = user.balance - 25
    const pay = payAdd(`Платеж за добавление в вакансии -25 UAH`,userId)
    await pay.save()
    await User.updateOne({_id: req.session.user._id}, {balance: balance})
    await req.files.forEach((el) => {
        new Promise((resolve, reject) => {
            const data = savePhoto(el)
            resolve(data)
            reject(false)
        }).then(data => {
            console.log('Save photo', data)
        })
    })
    req.flash('message', 'Объявление успешно добавлено')
    res.redirect('/lk')
})
module.exports = router