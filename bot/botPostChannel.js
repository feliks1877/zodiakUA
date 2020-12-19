let send = `https://api.telegram.org/bot1278360998:AAHoHmOb_y02gwRY3_kJTPgaVn5wY1yW8Ow/sendPhoto?`
const chatId = `-1001393521993`
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const httpBuild = require('http-build-query')
const Object = require('../models/objects')

function ajax(url) {
    console.log('URL',url)
    return new Promise((resolve, reject) => {
        const xhttp = new XMLHttpRequest()
        xhttp.open("GET", url)
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                console.log(xhttp.readyState)
                resolve(xhttp.readyState)
            }
        }
        xhttp.send()
    })
}

class BotPostChannel {
    static PostObj() {
        new Promise((resolve, reject)=>{
           let obj = Object.find().sort({date: 'desc'}).limit(1)
           resolve(obj)
        }).then(el => {
            let newObj = []
            el.forEach(e => {
                newObj.push(e.photo[0])
                newObj.push(e.name)
                newObj.push(e.description)
                newObj.push(e._id)
                newObj.push(e.city)
            })
            let keyboard =  {
                inline_keyboard: [
                    [{text: `${newObj[1]}`, url: `http://zodiak.world/id/${newObj[3]}`}]
                ]
            }
            let params = {
                'chat_id' : chatId,
                'photo' : `https://zodaikapp.s3.us-east-2.amazonaws.com/img/`+newObj[0],
                'caption': `<script>${newObj[1]} ${newObj[4]}</script>\r\n<i>${newObj[2]}</i>`,
                'reply_markup' : JSON.stringify(keyboard),
                'parse_mode' : "HTML"
            }
            let param = httpBuild(params)
            ajax(send + param).catch(e => console.log(e))
        }).catch(e => console.log(e))
    }
}
module.exports = BotPostChannel

