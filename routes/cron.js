const {Router} = require('express')
const Objects = require('../models/objects')
const workObj = require('../models/workObj')
const User = require('../models/user')
const schedule = require('node-schedule')
const Cron = require('cron').CronJob
const Pay = require('../models/pay')
const router = Router()


function payAdd(pay,userId,object){
    return new Pay({
        pay: pay,
        userId: userId,
        object: object,
        date: new Date()
    })
}
function counter() {
    let currCount = 1
    return function () {
        return currCount++
    }
}
const amount = counter()
let jobMidnight = new Cron('0 0 0 * * *', async function () {
    console.log('CRON-MIDNIGHT', new Date())
    const user = await User.find({balance: {$gt: 0}})
    const object = await Objects.find({active: 1})
    user.forEach((us) => {
        const arr = []
        for (let i = 0; i < object.length; i++) {
            if (us.id == object[i].userId) {
                arr.push(object[i])
            }
        }
        us.balance = us.balance - (arr.length * 15)
        const rbalance = arr.length * 15
        console.log(rbalance)
        new Promise((resolve, reject) => {
            User.findByIdAndUpdate({_id: us.id}, {balance: us.balance})
            const pay = payAdd(`Платеж за сутки ${rbalance} UAH`,us.id)
            resolve(pay.save())
        }).then((data) => {
            console.log('Списание за сутки',rbalance)
        })
    })
})
jobMidnight.start()

let eachHour = new Cron('0 * * * * *', async function () {
    const objects = await Objects.find({autoTop: {$ne : ''},active: 1}).populate('userId')
    objects.forEach((e) => {
        let d = new Date()
        function addZerro(i){
            if(i < 10){
                i = '0' + i
            }
            return i
        }
        let currDate = addZerro(d.getHours())+':'+addZerro(+d.getMinutes())
        if(e.autoTop === currDate){
            new Promise((resolve, reject) => {
                const newT = Objects.findByIdAndUpdate({_id: e.id},{date: d})
                resolve(newT)
            }).then((newT) => {
                const balance = e.userId.balance - 15
                new Promise((resolve, reject) => {
                    User.findByIdAndUpdate({_id: e.userId.id}, {balance: balance})
                    const pay = payAdd(`Платеж за автоподнятие для анкеты ${newT.name} -15 UAH`, e.userId.id,newT.id)
                    resolve(pay.save())
                })
            }).catch(err => console.log(err))
        }
    })
})
eachHour.start()


let jobMidnightWork = new Cron('0 0 0 * * *', async function () {
    console.log('CRON-MIDNIGHT', new Date())
    const user = await User.find({balance: {$gt: 0}})
    const object = await workObj.find({active: 1})
    user.forEach((us) => {
        const arr = []
        for (let i = 0; i < object.length; i++) {
            if (us.id == object[i].userId) {
                console.log('WORK',object[i].userId)
                arr.push(object[i])
            }
        }
        us.balance = us.balance - (arr.length * 15)
        const rbalance = arr.length * 15
        console.log(rbalance)
        new Promise((resolve, reject) => {
            User.findByIdAndUpdate({_id: us.id}, {balance: us.balance})
            const pay = payAdd(`Платеж за сутки Вакансии ${rbalance} UAH`,us.id)
            resolve(pay.save())
        }).then((data) => {
            console.log('за сутки Вакансии ',rbalance)
        })
    })
})
jobMidnightWork.start()



// schedule.scheduleJob('* * * * * *', function () {
//     console.log('Интервал (каждую минуту)', new Date())
//     })
// })
//
// schedule.scheduleJob('0 0 * * * *', function () {
//     console.log('Интервал второй 0', new Date())
// })
// schedule.scheduleJob('0 0 0 * * *', function () {
//     console.log('Интервал третий 0', new Date())
// })
// schedule.scheduleJob('* * * * * *',function (){
//     console.log('Интервал все *(каждую секунду)',new Date())
// })


module.exports = router