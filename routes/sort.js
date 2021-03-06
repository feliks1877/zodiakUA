const {Router} = require('express')
const City = require('../models/city')
const Objects = require('../models/objects')
const Review = require('../models/review')
const User = require('../models/user')
const meta = require('../headers/meta')
const func = require('../headers/function')
const filterAll = require('../function/filterAll')
const filterAllCity = require('../function/filterAllCity')
const Meta = require('../models/meta')
const router = Router()

function pagination(arr) {
    const p = arr.length / 50
    const page = []
    for (let i = 0; i < p; i++) {
        page.push(i + 1)
    }
    return page
}

router.get('/sort/', async (req, res) => {
    res.render('sort', {
        title: 'SORT'
    })
})
router.get('/sort/:filter', async (req, res) => {
    const user = req.session.user
    const city = await City.getAll()
    const filter = req.params.filter
    const pageNumber = req.params.page
    let arrLen = await Objects.find({active: 1})
    const objects = await filterAll(filter, pageNumber)
    let title = await Meta.tit(filter)
    const page = await pagination(arrLen)
    let description = Meta.metaDes(filter)
    await res.render('sort', {
        title: `${title}`,
        meta: `${title}, ${description}`,
        objects, city, user, filter, page
    })
})


router.get('/sort/:filter/page/:page', async (req, res) => {
    const user = req.session.user
    const filter = req.params.filter
    const pageNumber = req.params.page
    const city = await City.getAll()
    let arrLen = await Objects.find({active: 1})
    const objects = await filterAll(filter, pageNumber)
    let title = await Meta.tit(filter)
    const page = await pagination(arrLen)
    let description = Meta.metaDes(filter)
    await res.render('sort', {
        title: `${title}`,
        meta: `${title},${description}`,
        objects, city, user, filter, page
    })
})
router.get('/city/:city/sort/:filter/page/:page', async (req, res) => {
    const user = req.session.user
    const filter = req.params.filter
    const pageNumber = req.params.page
    const city = await City.getAll()
    const cityes = await City.getByCity(req.params.city)
    let arrLen = await Objects.find({active: 1, city: cityes.nameEn})
    const objects = await filterAllCity(cityes.nameEn, filter, pageNumber)
    let title = await Meta.tit(filter,cityes.name)
    const page = await pagination(arrLen)
    let description = await Meta.metaDes(filter,cityes.name)
    await res.render('sort', {
        title: `${title}`,
        meta: `${description}`,
        cityes, objects, city, user, filter, page
    })
})
router.get('/city/:city/sort/:filter', async (req, res) => {
    const filter = req.params.filter
    const pageNumber = req.params.page
    const city = await City.getAll()
    const cityes = await City.getByCity(req.params.city)
    let arrLen = await Objects.find({active: 1, city: cityes.nameEn})
    const objects = await filterAllCity(cityes.nameEn, filter, pageNumber)
    const user = req.session.user
    let title = await Meta.tit(filter, cityes.name)
    const page = await pagination(arrLen)
    let description = await Meta.metaDes(filter,cityes.name)
    console.log('DESC',description)
    await res.render('sort', {
        title: `${title}`,
        meta: `${description}`,
        cityes, objects, city, user, filter, page
    })
})

module.exports = router