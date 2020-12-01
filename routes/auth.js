const {Router} = require('express')
const User = require('../models/user')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const sendgrid = require('nodemailer-sendgrid-transport')
const keys = require('../keys')
const regEmail = require('../emails/registration')
const resetEmail = require('../emails/reset')
const router = Router()

const transporter = nodemailer.createTransport(sendgrid({
    auth: {api_key: keys.SENDGRID_API_KEY}
}))

router.get('/login', async (req, res) => {
    await res.render('auth/login', {
        title: 'Авторизация',
        isLogin: true,
        error: req.flash('error')
    })
})
router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login')
    })
})
router.post('/register', async (req, res) => {
    try {
        const user = new User({
            login: req.body.login,
            email: req.body.email,
            password: req.body.password,
            key: 0,
            balance: 0
        })
        const candidate = await User.findOne({email: user.email})
        console.log(candidate, user.email)
        if (candidate) {
            req.flash('error', 'Пользователь с такой почтой уже зарегистрирован')
            res.redirect('/login#register')
        } else {
            req.flash('error', 'Удачная регистрация')
            await user.save()
            req.session.user = user
            req.session.isAuthenticated = true
            req.session.save(err => {
                if (err) {
                    throw err
                } else {
                    isAuth: true,
                        req.flash('error', 'Удачная регистрация')
                    res.redirect('/lk')
                }
            })
            await transporter.sendMail(regEmail(user.email))
        }
    } catch (e) {
        console.log(e)
    }
})
router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body
        const candidate = await User.findOne({email})
        if (candidate) {

            const areSame = password === candidate.password
            if (areSame) {
                req.session.user = candidate
                req.session.isAuthenticated = true
                req.session.save(err => {
                    if (err) {
                        throw err
                    } else {
                        isAuth: true,
                            res.redirect('/lk')
                    }
                })
            } else {
                console.log('Неверный пароль')
                req.flash('error', 'Не верный пароль')
                res.redirect('/login')
            }
        } else {
            req.flash('error', 'Пользователь с такой почтой не зарегистрирован')
            console.log('Пользователь не зарегестрирован')
            res.redirect('/login')
        }
    } catch (e) {
        console.log(e)
    }
})

router.get('/reset', (req, res) => {
    res.render('auth/reset', {
        title: 'Восстановление пароля',
        error:  req.flash('error')
    })
})

router.get('/password/:token', async (req, res) => {
    if(!req.params.token){
        return res.redirect('/login')
    }
    try {
        const user = await User.findOne({
            resetToken: req.params.token,
            resetTokenExp: {$gt: Date.now()}
        })
        if(!user){
            return res.redirect('/login')
        }else{
            res.render('auth/password', {
                title: 'Восстановление пароля',
                error:  req.flash('error'),
                userId: user._id.toString(),
                token: req.params.token

            })
        }
    }catch (e){
        console.log('ERR PASSWORD', e)
    }

})

router.post('/password', async (req,res) => {
    try {
        const user = await User.findOne({
            _id: req.body.userId,
            resetToken: req.body.token,
            resetTokenExp: {$gt: Date.now()}
        })
        if(user){
            user.password = req.body.password
            console.log('Восстановление пароля',req.body.password)
            user.resetToken = undefined
            user.resetTokenExp = undefined
            await user.save()
            res.redirect('/login')
        }else{
            req.flash('loginError', 'Время восстановлени истекло')
            res.redirect('/login')
        }
    }catch (e) {
        console.log('ERR PASSWORD2', e)
    }
})

router.post('/reset', (req,res) => {
   try {
       crypto.randomBytes(32, async (err, buf) => {
           if (err){
               req.flash('error', 'Сервер не доступен, обратитесь в поддержку для восстановления досутпа')
               return res.redirect('/reset')
           }
           const token = buf.toString('hex')
           const candidate = await User.findOne({email: req.body.email})
           if(candidate){
               candidate.resetToken = token
               candidate.resetTokenExp = Date.now() + 60 * 60 * 1000
               await candidate.save()
               await transporter.sendMail(resetEmail(candidate.email,token))
               req.flash('error', 'Ссылка для восстановления пароля отправлена на Вашу почту')
               res.redirect('/login')
           }else{
               req.flash('error', 'Такой EMAIL не зарегистрирован')
               res.redirect('/reset')
           }
       })
   }catch (e) {
       console.log('ERROR RESET',e)
   }
})
module.exports = router