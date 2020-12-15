let topObj = document.querySelectorAll('[data-top]')
let balance = document.querySelectorAll('[data-balance]')
let passiveSupported = true

function blce(e) {
    let options = {style: 'currency', currency: 'UAH'}
    let newBalance = new Intl.NumberFormat('ua-UA', options)
    if (e.dataset.balance === 'value=') {
        e.textContent = 'Цена не указана'
    } else {
        e.textContent = newBalance.format(e.dataset.balance)
    }
}

if (balance) {
    balance.forEach((e) => {
        blce(e)
    })
}

function ajax(url) {
    return new Promise((resolve, reject) => {
        const xhttp = new XMLHttpRequest()
        xhttp.open("GET", url, true)
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                resolve(xhttp.readyState)
            }
        }
        xhttp.send()
    })
}
///////////////// ПОДНЯТИЕ ОБЪЯВЛЕНИЙ////////////////////
topObj.forEach(e => {
    e.onclick = function (event) {
        console.log(event.target.getAttribute('data-top'))
        ajax(event.target.getAttribute('data-top')).then(e => {
                console.log(e)
                if (e === 4) {
                    balance.forEach((el) => {
                        el.dataset.balance = el.dataset.balance - 15
                        blce(el)
                    })
                    let toastHTML = '<span>Объявление успешно поднято</span>';
                    M.toast({html: toastHTML});
                }
            }
        )
    }
})

// a.forEach((e) => {
//     e.addEventListener('click', () => {
//         ajax(e.dataset.top).then((el) => {
//             balance.forEach((el) => {
//                 el.dataset.balance = el.dataset.balance - 25
//                 blce(el)
//             })
//             let toastHTML = '<span>Объявление успешно поднято</span>';
//             M.toast({html: toastHTML});
//         }).catch((err) => {
//             console.log('errorTop', err)
//         })
//     }, passiveSupported ? {passive: true} : false)
// })

function counterFn(e1) {
    function counter() {
        let currCount = 1
        return function () {
            return currCount++
        }
    }

    let amount = counter()
    let active = counter()
    let passive = counter()
    e1.forEach((e) => {
        document.getElementById('amount').textContent = amount()
        if (e.dataset.act === '1') {
            document.getElementById('activeCount').textContent = active()
        } else {
            document.getElementById('passiveCount').textContent = passive()
        }
    })
}

//////////////////////////// ВКЛЮЧЕНИЕ ОТКЛЮЧЕНИЕ//////////////////////////////////////////
let sta = Array.prototype.slice.call(document.querySelectorAll('span[data-status]'))
counterFn(sta)

function statusIcon(el) {
    new Promise((resolve, reject) => {
        el.firstChild.remove()
        if (el.getAttribute('data-act') === '1') {
            el.insertAdjacentHTML('afterbegin', '<i class="green material-icons">play_circle_filled</i>')
            let toastHTML = '<span>Объявление опубликовано</span>';
            M.toast({html: toastHTML})
        } else {
            el.insertAdjacentHTML('afterbegin', '<i class="red material-icons">remove_circle</i>')
            let toastHTML = '<span>Объявление снято с публикации</span>'
            M.toast({html: toastHTML})
        }
        resolve(counterFn(sta))
    }).catch(e => {
        console.log(e)
    })
}

sta.forEach(e => {
    if (e.getAttribute('data-act') === '1') {
        e.insertAdjacentHTML('afterbegin', '<i class="green material-icons">play_circle_filled</i>')
    } else {
        e.insertAdjacentHTML('afterbegin', '<i class="red material-icons">remove_circle</i>')
    }
})

sta.forEach(e => {
    e.onclick = async function (event) {
        console.log(event.target)
        let elem = event.target.parentElement
        let url = elem.getAttribute('data-status') + (elem.getAttribute('data-act') === '1' ? 0 : 1)
        ajax(url).then(e => {
            let st = elem.getAttribute('data-act') === '1' ? '0' : '1'
            elem.setAttribute('data-act', st)
            statusIcon(elem)
        })
    }
})

////////////////////////////A U T O T O P/////////////////////////////////////
let auto = document.getElementsByName(`btnOn`)
auto.forEach((elem) => {
    elem.addEventListener('click', async () => {
        let xhr = new XMLHttpRequest
        let body = 'id=' + encodeURIComponent(elem.parentElement.id.value) + '&time=' + encodeURIComponent(elem.parentElement.time.value)
        await xhr.open('POST', '/lk/:autoTop', true)
        await xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                if (elem.parentElement.time.value === '') {
                    let toastHTML = '<span>Автоподнятие отключено</span>'
                    M.toast({html: toastHTML})
                } else {
                    let toastHTML = '<span>Автоподнятие включено</span>'
                    M.toast({html: toastHTML})
                }

            }
        }
        await xhr.send(body)
    })
})
////////////////////// R E C O M E N D A T I O N//////////////////////////
let rcm = document.querySelectorAll('[data-rcm]')
rcm.forEach(e => {
    e.onclick = function (event) {
        console.log(event.target.getAttribute('data-rcm'))
        ajax(event.target.getAttribute('data-rcm')).then(e => {
            if (e === 4) {
                let toastHTML = '<span>Добавлено в рекомендуемые</span>'
                M.toast({html: toastHTML})
            } else {
                let toastHTML = '<span>Ошибка попробуйте позже</span>'
                M.toast({html: toastHTML})
            }
        })
    }
})