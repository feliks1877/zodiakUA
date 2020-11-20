const {Router} = require('express')
const City = require('../models/city')
const router = Router()

router.get('/work', async (req, res) => {
    const city = await City.getAll()
    res.render('work', {
        title: 'Вакнсии',
        city
    })

})
module.exports = router