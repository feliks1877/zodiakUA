export const preload = window.setTimeout(() => {
    let elem = document.createElement('div')
    elem.classList.add('preload')
    let img = new Image()
    img.classList.add('logoMy')
    img.src = "/images/LOGO.svg"
    elem.appendChild(img)
    document.querySelector('html').insertAdjacentElement('afterbegin', elem)
    anime({
        targets: elem.children,
        scale: 0.7,
        opacity: 0.5,
        direction: 'alternate',
        loop: true,
        easing: 'cubicBezier(.5, .05, .1, .3)'
    });
    // window.onload = () => {
        window.setTimeout(function () {
            elem.remove()
        }, 2000);
    // }
}, 0)