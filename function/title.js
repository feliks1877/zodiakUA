module.exports = function tit(filter) {
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