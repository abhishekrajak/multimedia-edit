const myfile = document.getElementById('myfile')

myfile.onchange = function () {
    var reader = new FileReader() // CREATE AN NEW INSTANCE.

    reader.onload = function (e) {
        var img = new Image()
        img.src = e.target.result
        // console.log(e.target.result)

        img.onload = function () {
            var w = this.width
            var h = this.height

            console.log(w, h)
        }
    }
    reader.readAsDataURL(myfile.files[0])
}

