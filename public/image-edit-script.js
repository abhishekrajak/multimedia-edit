const myform = document.getElementById('myform')
const myfile = document.getElementById('myfile')
const file_height_width = document.getElementById('file-height-width');

myfile.onchange = function () {
    const reader = new FileReader() // CREATE AN NEW INSTANCE.

    reader.onload = function (e) {
        const img = new Image()
        img.src = e.target.result
        // console.log(e.target.result)

        img.onload = function () {
            const w = this.width
            const h = this.height
            file_height_width.textContent = `Height : ${h} px Breadth : ${w} px`
            console.log(w, h)
        }
    }
    reader.readAsDataURL(myfile.files[0])
}

function formSubmit(){
    myform.submit()
    myform.reset()
}