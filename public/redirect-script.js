let x
let count = 5

function start() {
    setInterval(counter, 1000)
    x = document.getElementById('count')
    x.innerText = count.toString(10)
}
function counter() {
    count--
    x.innerText = count.toString(10)
    if (count === 0) {
        window.location.href = 'http://localhost:3000/login'
    }
}
