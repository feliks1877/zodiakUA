const fs = require('fs')
const path = require('path')

class Meta {
    static metaDes(f){
        if(f === 'very'){
            let metaR = `Индивидуалки представленные в этом разделе реальные и соответсвуют фотографиям`
            return metaR
        }else if(f === `reiting`){
            let metaR = `Индивидуалки с рельными оценками и отзывами от настоящих клиентов. Самая актульная информация о протитутках `
            return metaR
        }else if(f === `asc`){
            let metaR = `VIP ESCORT Самые лучшие эскотницы на сайте ZODIAK Выбор для самых изибирательных мужчин лучших индивидуалок `
            return metaR
        }else if(f === `desc`){
            let metaR = `Дешевые индивидуалки  Прекрасный выбор проституткок на портале ZODIAK`
            return metaR
        }
    }
    static tit(filter) {
        if (filter === 'desc') {
            let title = 'Дешёвые проститутки'
            return title
        } else if (filter === 'asc') {
            let title = 'Дорогие проститутки'
            return title
        } else if (filter === 'reiting') {
            let title = 'Проститутки с высоким рейтингом'
            return title
        } else if (filter === 'very') {
            let title = 'Проститутки с проверенными фото'
            return title
        }
    }
}

module.exports = Meta