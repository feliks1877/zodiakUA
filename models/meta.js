const fs = require('fs')
const path = require('path')

class Meta {
    static morph(city){
        let arr = []
        let symbol = ['к','в','м','д','ч','р','н','с','я']
        let symbol_2 = ['а']
        let nonSymbol = ['т','ц','н']
        for (let i = 0;i < city.length;i++){
             arr.push(city[i])
        }
        let result = symbol.find(e => e === arr[arr.length -1])
        if(result !== undefined){
            return city + 'а'
        }
        let result_3 = nonSymbol.find(e => e === arr[arr.length -2])
        if(result_3 === undefined){
            let result_2 = symbol_2.find(e => e === arr[arr.length -1])
            if(result_2 !== undefined){
                arr.pop()
                arr.push('и')
                city = arr.toString().replace(/,/g,'')
                return city
            }
        }else if(result_3 !== undefined){
            let result_2 = symbol_2.find(e => e === arr[arr.length -1])
            if(result_2 !== undefined){
                arr.pop()
                arr.push('ы')
                city = arr.toString().replace(/,/g,'')
                return city
            }
        }
        return city
    }

    static metaDes(f){
        if(f === 'very'){
            let metaR = `Индивидуалки представленные в этом разделе реальные и соответсвуют фотографиям`
            return metaR
        }else if(f === `reiting`){
            let metaR = `Индивидуалки с рельными оценками и отзывами от настоящих клиентов. Самая актульная информация о протитутках `
            return metaR
        }else if(f === `asc`){
            let metaR = `VIP ESCORT Самые лучшие эскортницы на сайте ZODIAK. Выбор для самых изибирательных мужчин, лучших индивидуалок `
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