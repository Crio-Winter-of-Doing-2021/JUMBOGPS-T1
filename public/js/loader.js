const startPreLoader = () => {
    document.querySelector('.spinner-wrapper').style.display = 'flex'
}

const stopPreLoader = () => {
    setTimeout(() => {
        document.querySelector('.spinner-wrapper').style.display = 'none'
    }, 500)
}