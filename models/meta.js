const fs = require('fs')
const path = require('path')

class Meta {
    static morph(city) {
        let arr = []
        let symbol = ['к', 'в', 'м', 'д', 'ч', 'р', 'н', 'с', 'я']
        let symbol_2 = ['а']
        let nonSymbol = ['т', 'ц', 'н', 'с']
        for (let i = 0; i < city.length; i++) {
            arr.push(city[i])
        }
        let result = symbol.find(e => e === arr[arr.length - 1])
        if (result !== undefined) {
            return city + 'а'
        }
        let result_3 = nonSymbol.find(e => e === arr[arr.length - 2])
        if (result_3 === undefined) {
            let result_2 = symbol_2.find(e => e === arr[arr.length - 1])
            if (result_2 !== undefined) {
                arr.pop()
                arr.push('и')
                city = arr.toString().replace(/,/g, '')
                return city
            }
        }
        if (result_3 !== undefined) {
            let result_2 = symbol_2.find(e => e === arr[arr.length - 1])
            if (result_2 !== undefined) {
                arr.pop()
                arr.push('ы')
                city = arr.toString().replace(/,/g, '')
                return city
            }
        }
        return city
    }

    static metaDes(f, city) {
        const c = city !== undefined ? this.morph(city) : ''
        if (f === 'very') {
            let metaR = `Индивидуалки и проститутки ${c} с реалаьными фото, представленные в этом разделе реальные и соответсвуют анкетам`
            return metaR
        } else if (f === `reiting`) {
            let metaR = `Индивидуалки и проститутки ${c}, с рельными оценками и отзывами от настоящих клиентов. Самая актульная информация о протитутках ${c}`
            return metaR
        } else if (f === `asc`) {
            let metaR = `VIP ESCORT. Самые лучшие VIP эскортницы ${c} на сайте ZODIAK. Выбор для самых изибирательных мужчин,эскортниц и индивидуалок  ${'из ' + c}`
            return metaR
        } else if (f === `desc`) {
            let metaR = `Дешевые индивидуалки и проститутки ${c}. Прекрасный выбор проституткок из ${c} на портале ZODIAK`
            return metaR
        }
    }

    static tit(filter, city) {
        const c = city !== undefined ? this.morph(city) : ''
        if (filter === 'desc') {
            let title = `Дешёвые проститутки ${c}`
            return title
        } else if (filter === 'asc') {
            let title = `Дорогие проститутки ${c}`
            return title
        } else if (filter === 'reiting') {
            let title = `Проститутки с высоким рейтингом ${c}`
            return title
        } else if (filter === 'very') {
            let title = `Проститутки с проверенными фото ${c}`
            return title
        }
    }
}

module.exports = Meta