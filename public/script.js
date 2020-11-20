document.addEventListener('DOMContentLoaded', function () {
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
            e.style.width = b + '.5' + 'rem'
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
        e.previousElementSibling.style.display = 'none'
        e.style.display = 'none'
    })
})