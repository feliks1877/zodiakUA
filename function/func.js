class Func {
    static timeConvert(obj) {
        obj.forEach(el => {
            let time = ((new Date().getTime() - el.date.getTime()) / 3600000)
            if (time < 24) {
                let t = Math.round(time)
                let s = (t === 0) ? 'Сегодня' : (t === 1 || t === 21) ? `${t} час назад` :
                    (t >= 2 && t <= 4 || t >= 22)
                        ? `${t} часа назад` : (t >= 5 && t <= 20) ?
                        `${t} часов назад` :  null
                el.description.push(s)
            } else {
                const days = Math.round(time / 24)
                const ti = (days <= 1) ? 'Сегодня' : (days <= 4) ?
                    `${days} дня назад` : (days >= 5 && days < 21) ?
                        `${days} дней назад` : (days >= 22 && days < 25) ? `${days} дня назад` :
                            (days >= 25 && days <= 30) ? `${days} дней назад` : `Давно`
                el.description.push(ti)
            }
        })
    }
    static filBalance(arr, ob) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].userId.balance > 0) {
                ob.push(arr[i])
            }
        }
    }
    static pagination(arr) {
        const p = arr.length / 50
        const page = []
        for (let i = 0; i < p; i++) {
            page.push(i + 1)
        }
        return page
    }
}
module.exports = Func