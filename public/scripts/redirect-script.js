let x
let count = 5

function start() {
    setInterval(counter, 1000)
    x = document.getElementById('count')
    x.innerText = count.toString(10)
}
