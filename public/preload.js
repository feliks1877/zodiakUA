window.onload = () => {
    let elem = document.createElement('div')
    elem.classList.add('preload')
    let img = new Image()
    img.classList.add('logoMy')
    img.src = "/images/LOGO.svg"
    elem.appendChild(img)
    console.log('comen')
    document.querySelector('nav').insertAdjacentElement('beforebegin', elem)
    anime({
        targets: elem.children,
        scale: 0.7,
        opacity: 0.5,
        direction: 'alternate',
        loop: true,
        easing: 'cubicBezier(.5, .05, .1, .3)'
    });
    window.setTimeout(function () {
        elem.remove()
    }, 2500);

}