/////////////////////*ВЫПАДЮЩИЙ СПИСОК*////////////////////////////////
let labelDrop = document.getElementsByName("label--drop-down")
for (let i = 0; i < labelDrop.length; i++) {
    labelDrop[i].addEventListener('click', () => {
        labelDrop[i].nextElementSibling.classList.toggle('status')
        if (document.getElementsByClassName('closes').length === 0) {
            let elem = document.createElement('div')
            elem.classList.add('closes')
            elem.innerHTML = '<p>Закрыть</p>'
            document.getElementById('mobile-demo').insertAdjacentElement('afterbegin', elem)
            elem.addEventListener('click', () => {
                labelDrop.forEach(e => {
                    if (e.nextElementSibling.classList[0] !== "status") {
                        e.nextElementSibling.classList.add('status')
                    }
                })
                elem.remove()
            })
        }
        window.scrollTo(0, 0);
    })
}
let parentDrop = document.getElementById('parentDrop')
parentDrop !== null ? parentDrop.onclick = (event) => {
    // noinspection JSUnresolvedFunction
    event.currentTarget.scrollTo(0, 0)
} : null

document.addEventListener('DOMContentLoaded', function () {
    // noinspection JSDuplicatedDeclaration,JSUnusedLocalSymbols
    var elems = document.querySelectorAll('.sidenav');
    var elems = document.querySelectorAll('.carousel');
    var elems = document.querySelectorAll('.parallax');
    var elems = document.querySelectorAll('.fixed-action-btn');
    var elems = document.querySelectorAll('.dropdown-trigger');
    var elems = document.querySelectorAll('.modal');
    var elems = document.querySelectorAll('select');
    // var instances = M.Parallax.init(elems, options);
});

$(document).ready(function () {
    $('.tabs').tabs();
    $('.sidenav').sidenav();
    $('.parallax').parallax();
    $('.dropdown-trigger').dropdown();
    $('select').formSelect();
    $('.modal').modal();
    $('.fixed-action-btn').floatingActionButton();
    $('.carousel').carousel();
});
let p = document.querySelectorAll('input[type=range]')
if (p.length) {
    console.log('Qw', p.length)
    p.forEach((c, i) => {
        c.addEventListener('change', () => {
            if (i === 0) {
                c.previousElementSibling.textContent = 'Соответсвие фото ' + c.value + ' %'
            } else {
                c.previousElementSibling.textContent = 'Общая оценка ' + c.value
            }
        })
    })

}
//////////////// ВЫВОД ЗВЕЗД ДЛЯ РЕЙТИНГА//////////////////////
let appraisal = document.querySelectorAll('b[data-reiting]')
if (appraisal) {
    appraisal.forEach((e) => {
        console.log(e.dataset.reiting)
        for (let i = 0; e.dataset.reiting > i; i++) {
            let a = document.createElement('i')
            a.classList.add('fas')
            a.classList.add('fa-star')
            e.appendChild(a)
        }

    })
}
//////////////////////ЗВЕЗДНЫЙ РЕЙТИНГ ОЦЕНКА ОБЩАЯ РАСЧЕТ КОЛЛИЧЕСТВА ЗВЕЗД////////////////////////////////
let apl = document.querySelectorAll('[data-appraisal]')
apl.forEach((e) => {
    let a = Math.ceil(e.dataset.appraisal)
    let b = e.dataset.appraisal
    if (a > 0) {
        for (let i = 0; a > i; i++) {
            let a = document.createElement('i')
            a.classList.add('fas')
            a.classList.add('fa-star')
            e.appendChild(a)
            e.style.width = b + '.6' + 'rem'
        }
    } else {
        for (let i = 0; i < 5; i++) {
            let a = document.createElement('i')
            a.classList.add('far')
            a.classList.add('fa-star')
            e.appendChild(a)
        }
    }
})
/////////////// ЗАПОЛНЕНИЕ ЧЕКБОКСОВ ПРИ РЕДАКТИРОВАНИИ /////////////////////////////
// noinspection SpellCheckingInspection
let classik = document.querySelectorAll('em')
let input = document.querySelectorAll('input[type=checkbox]')
if (input.length) {
    input.forEach((e) => {
        classik.forEach((c) => {
            if (e.dataset.classik === c.dataset.classik) {
                e.checked = true
            }
        })
    })
}


///////////// ВЫВОД ОШИБКИ /////////////
window.addEventListener('load', () => {
    if (document.getElementById('err')) {
        let err = document.getElementById('err')
        M.toast({html: err.dataset.error})
    }
})

/////// СОЗДАНИЕ АТРИБУТА ДЛЯ ПОСТРАНИЧНОЙ НАВИГАЦИИ /////////
const url = document.location.pathname
const pageArr = document.querySelectorAll('[data-path]')
pageArr.forEach((el) => {
    if (el.dataset.path === url) {
        el.parentElement.classList.add('active')
        const href = el.getAttribute('href')
        const newHref = href.split('/')
        console.log(newHref, newHref[newHref.length - 1])
        document.getElementById('prev').setAttribute('href', parseInt(newHref[newHref.length - 1]) - 1)
        document.getElementById('next').setAttribute('href', parseInt(newHref[newHref.length - 1]) + 1)
        const pge = parseInt(newHref[newHref.length - 1]) - 1
        if (pge === 0) {
            document.getElementById('prevLi').classList.add('disabled')
            document.getElementById('prev').setAttribute('href', parseInt(newHref[newHref.length - 1]))
        }
    }
})

////////////////УДАЛЕНИЕ ФОТО В ЛИЧНОМ КАБИНЕТЕ///////////////
let removeImg = document.querySelectorAll('[data-remove]')
removeImg.forEach((e) => {
    e.addEventListener('click', () => {
        e.nextElementSibling.setAttribute('value', '')
        e.parentElement.style.display = 'none'
    })
})
/////////////////// ПРОВЕРЯЮ РАЗМЕР ЗАГРРУЖАЕМЫХ ФОТО МАКСИМУМ 2МГБ////////////
let photoSize = document.getElementById('photo')
if (photoSize) {
    photoSize.onchange = () => {
        const selectFiles = [...photoSize.files]
        selectFiles.forEach(e => {
            console.log(e.size)
            if (e.size > 2000000) {
                alert('Выбраный фаил превышает допустимый размер в два мегабайта, пожалуйста выберите другой фаил')
                document.getElementById('btn-lk').setAttribute('disabled', true)
                document.getElementById('btn-lk').textContent = 'Выбери другой файл'
            } else {
                photoSize.textContent = 'Выбрано ' + selectFiles + 'фото'
                document.getElementById('btn-lk').getAttribute('disabled') === true ?
                    document.getElementById('btn-lk').removeAttribute('disabled') : null
                document.getElementById('btn-lk').textContent = 'Загрузить'
            }
        })

        if (url === '/add' && selectFiles.length < 2) {
            photoSize.parentElement.style.background = 'rgba(247, 43, 11, 0.51)'
            let toastHTML = '<span>Минимум 2 фото</span>';
            M.toast({html: toastHTML});
        } else {
            photoSize.parentElement.style.background = '#26a69a'
            let toastHTML = '<span>Подтвердите загрузку фото</span>';
            M.toast({html: toastHTML});
        }
        photoSize.previousElementSibling.textContent = 'Выбрано ' + selectFiles.length + ' фото'
    }
}
///////////////// ВЫБОР ГЛАВНОГО ФОТО //////////////
let mainThingPhoto = document.querySelectorAll('[data-mainThingPhoto]')
let photoBlock = document.getElementById('photoBlock')
let photo = document.getElementsByName('photo[]')
let arrPhoto = Array.prototype.slice.call(photo)
arrPhoto.pop()
mainThingPhoto.forEach((e, i) => {
    e.onclick = () => {
        let mainPhoto = arrPhoto.splice(i, 1)
        arrPhoto.unshift(mainPhoto[0])
        let childBlock = photoBlock.children
        let arr = Array.prototype.slice.call(childBlock)
        arr.forEach(e => {
            e.remove()
        })
        arrPhoto.forEach(e => {
            let div = document.createElement('div')
            div.classList.add('block--photo')
            let img = document.createElement('img')
            img.src = 'https://zodaikapp.s3.us-east-2.amazonaws.com/img/' + e.id
            img.classList.add('img--lk')
            let elem = document.createElement('input')
            elem.type = 'hidden'
            elem.setAttribute('name', 'photo[]')
            elem.setAttribute('id', e.value)
            elem.setAttribute('value', e.value)
            let label = document.createElement('label')
            label.textContent = 'Удалить'
            label.setAttribute('for', e.id)
            label.setAttribute('data-remove', 'removeImg')
            let labelMain = document.createElement('label')
            labelMain.textContent = 'Сделать главным'
            labelMain.setAttribute('for', e.id)
            labelMain.setAttribute('data-mainThingPhoto', e.id)
            photoBlock.insertAdjacentElement('beforeend', div)
            div.insertAdjacentElement('beforeend', img)
            div.insertAdjacentElement('beforeend', label)
            div.insertAdjacentElement('beforeend', elem)
            div.insertAdjacentElement('beforeend', labelMain)
        })

    }
})

////////////////// ВАЛИДАЦИЯ ФОРМЫ ДОБАВЛЕНИЯ ЭСКОРТ///////////////
function validation(butt) {
    console.log(butt.dataset.block)
    let v = document.getElementById(butt.dataset.block)
    let valColl = v.getElementsByClassName('validateMain')
    let val = Array.prototype.slice.call(valColl)
    let count = 0
    val.forEach((el, i) => {
        if (el.validity.valid === false) {
            count++
            el.parentElement.style.background = '#f72b0b82'
        }
    })
    if (count > 0) {
        butt.previousElementSibling.style.background = '#f72b0b82'
        let toastHTML = '<span>Вы заполнили не все обязательные поля в предыдущем разделе</span>';
        M.toast({html: toastHTML});
    } else {
        butt.previousElementSibling.style.background = 'rgb(59 202 49 / 51%)'
    }
}

let vl = Array.prototype.slice.call(document.getElementsByClassName('validation'))
vl.forEach((e) => {
    e.addEventListener('click', function () {
        validation(this)
    })
})

let form = document.getElementById('formMain')
if (form != null) {
    form.onchange = function (event) {
        console.log('EVENT',event.target)
        if (event.target.validity.valid === false) {
            event.target.closest('div').style.backgroundColor = 'rgba(247,43,11,0.51)'
            console.log(false)
        } else {
            event.target.closest('div').style.backgroundColor = 'white'
            console.log(true)
        }
    }
    form.description.oninput = function () {
        console.log(form.description.value);
        document.getElementById('counter').textContent = form.description.value.length;
    }
    form.onsubmit = () => {
        document.getElementById('spinner').removeAttribute('style')
    }
}
let formSub = Array.prototype.slice.call(document.getElementsByTagName('form'))
if (formSub != null) {
    formSub.forEach(e => {
        e.onsubmit = () => {
            document.getElementById('spinner').removeAttribute('style')
        }
    })
}
let imgParallax = document.getElementById('imgParallax')
if (imgParallax != null) {
    if (window.matchMedia(`(min-width: 600px)`).matches) {
        imgParallax.setAttribute('src', '/images/5.jpg')
    }
}
////////////////// СКРЫТЬ НЕ ВИДИМЫЕ ИЗОБРАЖЕНИЯ /////////////////
function isVisible(elem) {

    let coords = elem.getBoundingClientRect();

    let windowHeight = document.documentElement.clientHeight;

    // верхний край элемента виден?
    let topVisible = coords.top > 0 && coords.top < windowHeight;
    // нижний край элемента виден?
    let bottomVisible = coords.bottom < windowHeight && coords.bottom > 0;

    return topVisible || bottomVisible;
}
function showVisible() {
    for (let img of document.querySelectorAll('img')) {
        let realSrc = img.dataset.src;
        if (!realSrc) continue;
        if (isVisible(img)) {
            img.src = realSrc;
            img.dataset.src = '';
        }
    }
}
showVisible();
window.onscroll = showVisible;
// ВЫВОД ТЕКУЩЕГО ВРЕМЕНИ СУТОК СЕРВЕРА//
let timeSpan = Array.prototype.slice.call(document.getElementsByClassName('timeCurrent'))
if(timeSpan.length){
    timeSpan.forEach(e => {
        e.textContent = ' '+new Date().getHours()+':'+ new Date().getMinutes()
    })
}


