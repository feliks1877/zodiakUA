const {Router} = require('express')
const City = require('../models/city')
const savePhoto = require('../function/savePhoto')
const Object = require('../models/objects')
const User = require('../models/user')
const {validationResult} = require('express-validator')
const {addValidators} = require('../utils/validator')
const keys = require('../keys')
const router = Router()

router.get('/add', async (req, res) => {
    // noinspection JSUnresolvedFunction
    const city = await City.getAll()
    if (req.session.isAuthenticated === true) {
        await res.render('add', {
            title: 'Добавить объявление',
            city
        })
    } else {
        await req.flash('error', 'Чтобы добавить объявление необходимо авторизоваться')
        res.redirect('/login')
    }
})

router.post('/add', addValidators, async (req, res) => {
    const err = validationResult(req)
    console.log(err)
    if(!err.isEmpty()){
        // noinspection JSUnresolvedFunction
        req.flash('message', err.array()[0].msg)
        return res.status(422).redirect('/lk')
    }

    // noinspection JSUnresolvedVariable
    const userId = req.session.user._id
    const path = []

    // noinspection JSUnresolvedVariable
    await req.files.forEach((el) => {
        path.push(el.filename)
    })
    // noinspection SpellCheckingInspection
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
    } catch (e) {
        console.log(e)
    }
})


module.exports = router


//
// fs.readFile(el.path, function (err, data) {
//     if (err) {
//         throw err;
//     }
//     console.log('DATA', data, 'TYPE', req.file)
//     const params = {
//         Bucket: keys.S3_BUCKET,
//         Key: el.filename,
//         Body: data,
//         ContentType: el.mimetype,
//         ACL: 'public-read'
//     };
//     console.log(params)
//     s3.putObject(params, function (err, data) {
//         if (err) {
//             console.log(err)
//         } else {
//             console.log("Successfully uploaded data to myBucket/myKey", data);
//         }
//     })
// });