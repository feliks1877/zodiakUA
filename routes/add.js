const {Router} = require('express')
const City = require('../models/city')
const Object = require('../models/objects')
const User = require('../models/user')
const router = Router()

router.get('/add', async (req, res) => {
    const city = await City.getAll()
    if(req.session.isAuthenticated === true) {
    res.render('add', {
        title: 'Добавить объявление',
        city
    })
    }else {
        req.flash('error', 'Чтобы добавить объявление необходимо авторизоваться')
        res.redirect('/login')
    }
})

router.post('/add', async (req, res) => {
    const userId = req.session.user._id
    const path = []
    req.files.forEach((el)=>{
        path.push(el.filename)
    })
    const object = new Object({
        city: req.body.city,
        type: req.body.type,
        address: req.body.address,
        name: req.body.name,
        paramModel: req.body.paramModel,
        bdsm: req.body.bdsm,
        phone: req.body.phone,
        price: req.body.price,
        photo: path,
        description: req.body.description,
        classik: req.body.classik,
        massage: req.body.massage,
        other: req.body.other,
        appraisal: req.body.appraisal,
        veryfication: 0,
        active: 1,
        userId: userId,
        autoTop: '',
        rcm: new Date(),
        date: new Date()
    })
    try {
        await object.save()
        const user = await User.findById(userId)
        const balance = user.balance - 25
        await User.updateOne({_id: req.session.user._id}, {balance: balance})
        res.redirect('/escort')
    }catch (e) {
        console.log(e)
    }

})

module.exports = router