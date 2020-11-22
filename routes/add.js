const fs = require('fs');
const {Router} = require('express')
const City = require('../models/city')
const aws = require('aws-sdk')
const Object = require('../models/objects')
const User = require('../models/user')
const keys = require('../keys')
const router = Router()
aws.config.update({
    "accessKeyId": keys.AWS_ACCESS_KEY_ID,
    "secretAccessKey": keys.AWS_SECRET_ACCESS_KEY,
    "region": 'us-east-2'
});
let s3 = new aws.S3({
    apiVersion: "2006-03-01",
    params: {Bucket: keys.S3_BUCKET}
})


router.get('/add', async (req, res) => {
    const city = await City.getAll()
    if(req.session.isAuthenticated === true) {
        await res.render('add', {
        title: 'Добавить объявление',
        city
    })
    }else {
        await req.flash('error', 'Чтобы добавить объявление необходимо авторизоваться')
        res.redirect('/login')
    }
})

router.post('/add', async (req, res) => {
    const userId = req.session.user._id
    const path = []
    await req.files.forEach((el)=>{
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
        await req.files.forEach((el)=> {
            fs.readFile(el.path, function (err, data) {
                if (err) {
                    throw err;
                }
                console.log('DATA', data, 'TYPE', req.file)
                const params = {
                    Bucket: keys.S3_BUCKET,
                    Key: el.filename,
                    Body: data,
                    ContentType: el.mimetype,
                    ACL: 'public-read'
                };
                console.log(params)
                s3.putObject(params, function (err, data) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("Successfully uploaded data to myBucket/myKey", data);
                    }
                })
            });
        })
        res.redirect('/escort')
    }catch (e) {
        console.log(e)
    }

})

module.exports = router