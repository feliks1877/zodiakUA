const {Router} = require('express')
const City = require('../models/city')
const Object = require('../models/objects')
const workObj = require('../models/workObj')
const User = require('../models/user')
const Pay = require('../models/pay')
const bodyParser = require('body-parser')
const keys = require('../keys')
const QiwiBillPaymentsAPI = require('@qiwi/bill-payments-node-js-sdk')
const publicKey = keys.QIWI_PUBLIC_KEY
const qiwiApi = new QiwiBillPaymentsAPI(keys.QIWI_SECRET_KEY)
const billId = qiwiApi.generateId()
let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
let jsonParser = bodyParser.json()

const router = Router()

function payAdd(pay, userId, object) {
    return new Pay({
        pay: pay,
        userId: userId,
        object: object,
        date: new Date()
    })
}

//////////Добавление в рекомендуемые
router.get('/rcm/:rcm', async (req, res) => {
    const userObj = await Object.findByIdAndUpdate({_id: req.params.rcm}, {rcm: new Date()}).populate('userId')
    const user = await User.findById({_id: req.session.user._id})
    const balance = user.balance - 30
    await User.updateOne({_id: req.session.user._id}, {balance: balance})
    const pay = payAdd(`Платеж за добавление в рекомендуемые для анкеты ${userObj.name} -30UAH`, req.session.user._id, userObj.id,)
    await pay.save()
    res.send('GOOD')
})

router.get('/lk', async (req, res) => {
    if (req.session.isAuthenticated === true) {
        const user = await User.findById(req.session.user._id)
        const objects = await Object.find().where('userId').equals(req.session.user._id).sort({date: 'desc'})
        const WorkObj = await workObj.find({userId: req.session.user._id}).sort({date: 'desc'})
        res.render('lk', {
            title: req.session.user.login,
            message: req.flash('message'),
            objects, WorkObj,
            user
        })
    } else {
        req.flash('error', 'Сначала авторизуйтесь')
        res.redirect('/login')
    }
})

router.get('/:id/lk', async (req, res) => {
    const obj = await Object.findByIdAndUpdate({_id: req.params.id}, {date: new Date()})
    const user = await User.findById({_id: req.session.user._id})
    const balance = user.balance - 25
    await User.updateOne({_id: req.session.user._id}, {balance: balance})
    const pay = payAdd(`Платеж за поднятие для анкеты ${obj.name} -25UAH.`, req.session.user._id, obj.id,)
    await pay.save()
    res.redirect('/lk')
})
//////////// Включение/Отключение анкеты
router.get('/active/:id', async (req, res) => {
    await Object.updateOne({_id: req.params.id}, {active: req.query.active})
    await res.redirect('/lk')
})
///////////Автоподнтие
router.post('/lk/:autoTop', async (req, res) => {
    await Object.findByIdAndUpdate(req.body.id, {autoTop: req.body.time})
    await res.redirect('/lk')
})
/////////// История платежей
router.get('/pay/:pay', async (req, res) => {
    console.log('GOOD', req.params.pay)
    const pay = await Pay.find({userId: req.params.pay}).sort({date: 'desc'}).limit(50)
    res.render('pay', {
        title: 'История платежей',
        pay
    })
})
/////////// Оплата
router.get('/oplata',(req, res) => {
    console.log('GOOD')
     res.render('oplata')
})
router.get('/oplata/:amount', async (req, res) => {
    if(req.session.user !== undefined){
        const params = {
            publicKey,
            amount: req.params.amount,
            email: req.session.user.email,
            billId: billId,
            successUrl: `https://zodiak.world/oplata/${billId}`
        }
        const link = qiwiApi.createPaymentForm(params);
        res.render('oplata', {
            link: link
        })
    }else {
        qiwiApi.getBillInfo(req.params.amount).then( data => {
            res.render('oplata', {
                title: `Успешная оплата`,
                object: JSON.stringify(data)
            })
        }).catch(e => {
            console.log(e)
        })
    }

})

router.post('/oplata', jsonParser ,async (req, res) => {
    const user = await User.findOne({email: req.body.bill.customer.email})
    let balance = parseInt(user.balance) + (Math.round(parseInt(req.body.bill.amount.value)/2.6))
    await User.updateOne({email: req.body.bill.customer.email},{balance: balance})
    const pay = payAdd(`Пополнение ${req.body.bill.amount.value} UAH`,user._id)
    await pay.save()
    res.sendStatus(200)
})

module.exports = router