const {Router} = require('express')
const City = require('../models/city')
const router = Router()

router.get('/', async (req, res) => {
    const city = await City.getAll()
    res.render('index', {
        title: 'Главная',
        meta: `Лучшие проститутки со всей Украины на ZODIAK`,
        isHome: true,
        error: req.flash('error'),
        city
    })
})
module.exports = router