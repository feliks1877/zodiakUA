const {Telegraf} = require('telegraf')
const {MenuTemplate, MenuMiddleware} = require('telegraf-inline-menu')
const keys = require('../keys')
const BOT_TOKEN = keys.BOT_TOKEN
const bot = new Telegraf(BOT_TOKEN)
const City = require('../models/city')
const Object = require('../models/objects')
const workObj = require('../models/workObj')

// noinspection JSUnresolvedFunction
const region = City.getAll()
const regionArr = []
region.then((el) => {
    for (let i = 0; i < el.length; i++) {
        regionArr.push(el[i])
    }
})

const city = City.getAll()
const cityArr = []
city.then((el) => {
    for (let i = 0; i < el.length; i++) {
        cityArr.push(el[i])
    }
    return cityArr
})

function searchCity(region) {
    let c = region.replace('/', '')
    let citAr = cityArr.find(e => e.nameEn === c)
    let city = []
    // noinspection JSUnresolvedVariable
    citAr.cities.forEach(el => {
        city.push(el)
    })
    return city
}

bot.command('start', async (ctx) => {
    await ctx.reply(`Я помогу найти анкеты проверенных эскортниц в любом городе Украины размещённых на сайте ZODIAK, просто начни вводить /`)
    await ctx.replyWithPhoto(`http://zodiak.world/images/2.jpg`, {
        caption: `ЛУЧШИЕ ЭСКОРТ МОДЕЛИ`,
        reply_markup: {
            inline_keyboard: [
                [{text: `ZODIAK`, url: `http://zodiak.world/`}]
            ]
        }
    })
})

bot.command('work', async (ctx, next) => {
    try {
        const WorkObj = await workObj.find({active: 1}).sort({date: 'desc'}).limit(20)
        if (WorkObj.length <= 0) {
            await ctx.reply('Объявлений не обнаруженно')
        }
        WorkObj.forEach(el => {
            ctx.replyWithPhoto(`https://zodaikapp.s3.us-east-2.amazonaws.com/img/${el.photo[0]}`, {
                caption: `${el.description}`,
                reply_markup: {
                    inline_keyboard: [
                        [{text: `Смотреть объявление`, url: `http://zodiak.world/id/${el._id}`}]
                    ]
                }
            })
        })
        return true
    } catch (e) {
        console.log(e)
    }
})

bot.command('random', async (ctx, next) => {
    try {
        const object = await Object.find({active: 1}).sort({date: 'desc'}).limit(20)
        if (object.length <= 0) {
            await ctx.reply('Проверенных анкет в данном городе не обнаруженно')
        }
        object.forEach(el => {
            ctx.replyWithPhoto(`https://zodaikapp.s3.us-east-2.amazonaws.com/img/${el.photo[0]}`, {
                caption: `${el.city}\r\n${el.description}`,
                reply_markup: {
                    inline_keyboard: [
                        [{text: `${el.name}`, url: `http://zodiak.world/id/${el._id}`}]
                    ]
                }
            })
        })
        return true
    } catch (e) {
        console.log('ERR RANDOM BOT', e)
    }
})

bot.use(async (ctx, next) => {
    try {
        if (ctx.updateType === 'message') {
            const choiceCity = new MenuTemplate(`Выбрать город`)
            const listCity = searchCity(ctx.update.message.text)
            listCity.forEach(e => {
                // noinspection JSUnresolvedVariable
                choiceCity.interact(`${e.name}`, `${e.nameEn}`, {
                    do: async ctx => {
                        await ctx.replyToContext(ctx)
                        return true
                    }
                })
            })
            const cityMiddle = new MenuMiddleware('/city/', choiceCity)
            return cityMiddle.replyToContext(ctx)
        }
        const trigger = ctx.update.callback_query.data.match('/city/')
        if (trigger[0] === '/city/') {
            const cityDB = ctx.update.callback_query.data.replace('/city/', '')
            const object = await Object.find({active: 1}).where('city').equals(cityDB).sort({date: 'desc'}).limit(20)
            if (object.length <= 0) {
                await ctx.reply('Проверенных анкет в данном городе не обнаруженно')
            }
            object.forEach(el => {
                ctx.replyWithPhoto(`https://zodaikapp.s3.us-east-2.amazonaws.com/img/${el.photo[0]}`, {
                    caption: `${cityDB}\r\n${el.description}`,
                    reply_markup: {
                        inline_keyboard: [
                            [{text: `${el.name}`, url: `http://zodiak.world/id/${el._id}`}]
                        ]
                    }
                })
            })
        }
    } catch (e) {
        console.log('ERROR_COMAND', e)
        return next()
    }
})
bot.use(async (ctx) => {
    await ctx.reply('Вы ввели что то не внятное, введите слэш "/" и дождитесть списка команд')
})
bot.catch(error => {
    console.log('telegraf error', error.response, error.parameters, error.on || error)
})

bot.launch().then(res => {
    console.log('Started Bot')
}).catch(e => console.log(e))



