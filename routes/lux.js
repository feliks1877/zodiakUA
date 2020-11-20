const {Router} = require('express')
const City = require('../models/city')
const router = Router()

router.get('/lux', async (req, res) => {
    req.flash('error', 'Досутп к данному разделу возможен только по рекомендации рекламодателей'),
    res.redirect('/')
})
module.exports = router
