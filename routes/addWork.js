const {Router} = require('express')
const Country = require('../models/country')
const savePhoto = require('../function/savePhoto')
const WorkObj = require('../models/workObj')
const User = require('../models/user')
const Pay = require('../models/pay')
const {validationResult} = require('express-validator')
const {workValidators} = require('../utils/validator')
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
// noinspection SpellCheckingInspection
router.post('/add/workadd', workValidators, async (req,res) => {
    console.log('REQBODY',req.body.podtype)
    const err = validationResult(req)
    console.log('ERR VALID WORK',err)
    if(!err.isEmpty()){
        // noinspection JSUnresolvedFunction
        req.flash('message', err.array()[0].msg)
        return res.status(422).redirect('/lk')
    }
    // noinspection JSUnresolvedVariable
    const userId = req.session.user._id
    const path = []
    // noinspection JSUnresolvedVariable
    console.log(req.files)
    // noinspection JSUnresolvedVariable
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
    const balance = user.balance - 15
    const pay = payAdd(`Платеж за добавление в вакансии -15 UAH`,userId)
    await pay.save()
    // noinspection JSUnresolvedVariable
    await User.updateOne({_id: req.session.user._id}, {balance: balance})
    // noinspection JSUnresolvedVariable
    await req.files.forEach((el) => {
        new Promise((resolve, reject) => {
            const data = savePhoto(el)
            resolve(data)
            reject(false)
        }).then(data => {
            console.log('Save photo', data)
        })
    })
    // noinspection JSUnresolvedFunction
    req.flash('message', 'Объявление успешно добавлено')
    res.redirect('/lk')
})
module.exports = router