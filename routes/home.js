const {Router} = require('express')
const City = require('../models/city')
const meta = require('../headers/meta')
const Bot = require('../bot/botPostChannel')
const router = Router()

router.get('/', async (req, res) => {
    const city = await City.getAll()
    res.render('index', {
        title: `Escort Ukraine`,
        meta:  meta.metaHome,
        isHome: true,
        error: req.flash('error'),
        city
    })
})
module.exports = router