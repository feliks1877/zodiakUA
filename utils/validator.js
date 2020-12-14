const {body} = require('express-validator')

exports.loginValidators = [
    body('email','Введите корректный Email').isEmail().normalizeEmail().escape(),
    body('password','Пароль должен быть минимум 5 символов')
        .isLength({min: 5, max: 56}).escape()
        .trim(),
]

exports.regValidators = [
    body('login','Login должен быть не менее 3 и не более 15 символов')
        .isLength({min: 3,max: 15}).escape().trim(),
    body('password','Пароль должен быть минимум 5 символов')
        .isLength({min: 5, max: 56}).escape().trim(),
    body('email','Введите корректный Email').isEmail().normalizeEmail().escape(),
]

exports.addValidators = [
    body('address','Не корректный адрес').isLength({max: 60}).escape().trim(),
    body('city', 'Не корректно указан город').isLength({max: 60}).escape().trim(),
    body('name','Не корректное имя').isLength({max: 20}).escape().trim(),
    body('paramModel[]', 'Проверить параметры модели').isLength({max: 60}).escape().trim(),
    body('phone[]', 'Проверьте данные контактов').isLength({max: 60}).escape().trim(),
    body('price[]', 'Проверьте данные в поле цены').isLength({max: 60}).escape().trim(),
    body('price[]', 'Проверьте данные в поле цены').isLength({max: 60}).escape().trim(),
    body('photo[]', 'Проверьте данные в поле фото').escape().trim(),
    body('description', 'Проверьте данные в поле описание').escape().trim(),
    body('classik[]', 'Проверьте данные в классических услугах').isLength({max: 60}).escape().trim(),
    body('bdsm[]', 'Проверьте данные в классических bdsm').isLength({max: 60}).escape().trim(),
    body('massage[]', 'Проверьте данные в классических massage').isLength({max: 60}).escape().trim(),
    body('other[]', 'Проверьте данные в классических разное').isLength({max: 60}).escape().trim(),
]

exports.editValidation = [
    body('address','Не корректный адрес').isLength({max: 60}).escape().trim(),
    body('city', 'Не корректно указан город').isLength({max: 60}).escape().trim(),
    body('name','Не корректное имя').isLength({max: 20}).escape().trim(),
    body('paramModel[]', 'Проверить параметры модели').isLength({max: 60}).escape().trim(),
    body('phone[]', 'Проверьте данные контактов').isLength({max: 60}).escape().trim(),
    body('price[]', 'Проверьте данные в поле цены').isLength({max: 60}).escape().trim(),
    body('price[]', 'Проверьте данные в поле цены').isLength({max: 60}).escape().trim(),
    body('photo[]', 'Проверьте данные в поле фото').escape().trim(),
    body('description', 'Проверьте данные в поле описание').escape().trim(),
    body('classik[]', 'Проверьте данные в классических услугах').isLength({max: 60}).escape().trim(),
    body('bdsm[]', 'Проверьте данные в классических bdsm').isLength({max: 60}).escape().trim(),
    body('massage[]', 'Проверьте данные в классических massage').isLength({max: 60}).escape().trim(),
    body('other[]', 'Проверьте данные в классических разное').isLength({max: 60}).escape().trim(),
    body('id').escape().trim()
]