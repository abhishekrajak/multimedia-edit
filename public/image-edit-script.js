const myfile = document.getElementById('myfile')
const file_height_width = document.getElementById('file-height-width');

myfile.onchange = function () {
    var reader = new FileReader() // CREATE AN NEW INSTANCE.

    reader.onload = function (e) {
        var img = new Image()
        img.src = e.target.result
        // console.log(e.target.result)

        img.onload = function () {
            var w = this.width
            var h = this.height
            file_height_width.textContent = `Height : ${h} px Breadth : ${w} px`
            console.log(w, h)
        }
    }
    reader.readAsDataURL(myfile.files[0])
}