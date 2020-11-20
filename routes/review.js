const {Router} = require('express')
const City = require('../models/city')
const Review = require('../models/review')
const Object = require('../models/objects')
const User = require('../models/user')
const router = Router()

router.get('/review/:id', async (req, res) => {
    const city = await City.getAll()
    const id = req.params.id
    console.log('SESSION',req.session)
    if(req.session.isAuthenticated === true) {
        const user = await User.findById(req.session.user._id)
        res.render('review', {
            title: 'Отзывы',
            city,
            user,
            id
        })
    }else {
        req.flash('error', 'Чтобы оставить отзыв необходимо авторизоваться')
        res.redirect('/login')
    }




})

router.post('/review', async (req, res) => {
    const r = new Review({
        login: req.body.login,
        disc: req.body.disc,
        photoRev: req.body.photoRev,
        very: req.body.very,
        review: req.body.review,
        objectId: req.body.objId
    })
    await r.save()
    const review = await Review.find({objectId: req.body.objId}).select('very')
    const obj = await Object.findById(req.body.objId)
    const arrReview = []
    const s = []
    review.forEach((c) => {
            arrReview.push(c)
            s.push(parseInt(c.very))
    })
    if (s.length > 0) {
        const total = s.reduce(function (a, b) {
            return a + b
        }) / arrReview.length
        arrReview.push(total.toFixed(1))
    }
    obj.appraisal = arrReview.pop()
    console.log(obj.appraisal)
    await Object.updateOne({_id: req.body.objId},{appraisal: obj.appraisal})
    res.redirect('/escort')
})

module.exports = router