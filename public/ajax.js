let a = document.querySelectorAll('a[data-top]')
let balance = document.querySelectorAll('[data-balance]')
let passiveSupported = true

function blce(e) {
    let options = {style: 'currency', currency: 'UAH'}
    let newBalance = new Intl.NumberFormat('ua-UA', options)
    if(e.dataset.balance === 'value='){
        e.textContent = 'Цена не указана'
    }else {
        e.textContent = newBalance.format(e.dataset.balance)
    }
}

if (balance) {
    balance.forEach((e)=>{
        blce(e)
    })
}
function status(e, cls, cls2, text) {
    let elem = document.createElement('i')
    elem.classList.add(cls)
    elem.classList.add(cls2)
    elem.textContent = text
    e.append(elem)
}

function ajax(url) {
    return new Promise((resolve, reject) => {
        const xhttp = new XMLHttpRequest()
        xhttp.open("GET", url, true)
        xhttp.onload = () => resolve(xhttp.readyState)
        xhttp.onerror = () => reject(xhttp.onreadystatechange)
        xhttp.send();
    })
}

a.forEach((e) => {
    e.addEventListener('click', () => {
        ajax(e.dataset.top).then((el) => {
            balance.forEach((el)=>{
                el.dataset.balance = el.dataset.balance - 25
                blce(el)
            })
            let toastHTML = '<span>Объявление успешно поднято</span>';
            M.toast({html: toastHTML});
        }).catch((err) => {
            console.log('errorTop', err)
        })
    }, passiveSupported ? {passive: true} : false)
})

let sta = document.querySelectorAll('span[data-status]')

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

counterFn(sta)

function ajaxActive(e, url) {
    url + '0';
    ajax(url).then(() => {
        for (let i = 0; i < e.children.length; i++) {
            e.children[i].remove()
        }
        e.dataset.act = '0'
        status(e, 'material-icons', 'red', 'remove_circle')
        let toastHTML = '<span>Объявление снято с публикации</span>';
        M.toast({html: toastHTML});
    }).catch(err => console.log('Error', err))
}

function ajaxOff(e, url) {
    url + '1';
    ajax(url).then(() => {
        for (let i = 0; i < e.children.length; i++) {
            e.children[i].remove()
        }
        e.dataset.act = '1'
        status(e, 'material-icons', 'green', 'play_circle_filled')
        let toastHTML = '<span>Объявление опубликовано</span>';
        M.toast({html: toastHTML});
    }).catch(err => console.log('Error', err))
}

sta.forEach((e, i, obj) => {
    if (e.dataset.act > 0) {
        status(e, 'material-icons', 'green', 'play_circle_filled')
        e.addEventListener('click', async () => {
            let url = e.dataset.status + '0';
            await ajaxActive(e, url, obj)
            await counterFn(sta)
        })

    } else {
        status(e, 'material-icons', 'red', 'remove_circle')
        e.addEventListener('click', async () => {
            try {
                let url = e.dataset.status + '1';
                await ajaxOff(e, url, obj)
                await counterFn(sta)
            }catch (err){
                console.log(err)
            }
        })
    }
})


// RECOMENDATION
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
                    var toastHTML = '<span>Автоподнятие отключено</span>'
                } else {
                    var toastHTML = '<span>Автоподнятие включено</span>'
                }
                M.toast({html: toastHTML})
            }
        }
        await xhr.send(body)
    })
})
let rcm = document.querySelectorAll('[data-rcm]')
rcm.forEach((elem) => {
    elem.addEventListener('click', async () => {
        const xhttp = new XMLHttpRequest()
        let url = '/rcm/' + elem.dataset.rcm
        xhttp.open("GET", url, true)
        xhttp.send()
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                var toastHTML = '<span>Добавлено в рекомендуемые</span>'
                M.toast({html: toastHTML})
            }
        }
    })
})