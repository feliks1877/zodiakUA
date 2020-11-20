const {Router} = require('express')
const User = require('../models/user')
const nodemailer = require('nodemailer')
const sendgrid = require('nodemailer-sendgrid-transport')
const keys = require('../keys')
const regEmail = require('../emails/registration')
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
                    req.flash('error', 'Удачная регистрация')
                    isAuth: true,
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
                        // console.log('',req.session)
                        req.flash('error', 'Удачная авторизация')
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
module.exports = router