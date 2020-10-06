(function () {
    var width = 320;    // We will scale the photo width to this
    var height = 0;     // This will be computed based on the input stream

    var streaming = false;

    var video = null;
    var canvas = null;
    var photo = null;
    var startbutton = null;

    function startup() {
        video = document.getElementById('video');
        canvas = document.getElementById('canvas');
        photo = document.getElementById('photo');
        startbutton = document.getElementById('startbutton');

        navigator.mediaDevices.getUserMedia({video: true, audio: false})
            .then(function (stream) {
                video.srcObject = stream;
                video.play();
            })
            .catch(function (err) {
                console.log("An error occurred: " + err);
            });

        video.addEventListener('canplay', function (ev) {
            if (!streaming) {
                height = video.videoHeight / (video.videoWidth / width);

                video.setAttribute('width', width);
                video.setAttribute('height', height);
                canvas.setAttribute('width', width);
                canvas.setAttribute('height', height);
                streaming = true;
            }
        }, false);

        startbutton.addEventListener('click', function (ev) {
            takepicture();
            ev.preventDefault();
        }, false);

        clearphoto();
    }

    function clearphoto() {
        var context = canvas.getContext('2d');
        context.fillStyle = "#AAA";
        context.fillRect(0, 0, canvas.width, canvas.height);

        var data = canvas.toDataURL('image/png');
    }

    function takepicture() {
        var context = canvas.getContext('2d');
        if (width && height) {
            canvas.width = width;
            canvas.height = height;
            context.drawImage(video, 0, 0, width, height);

            var data = canvas.toDataURL('image/png');
            var gallery = document.getElementById("gallery");
            gallery.insertAdjacentHTML('beforeend', '<div class="col mb-4">' +
                '            <div class="card">' +
                '                <img src=' + data + ' class="card-img-top img-thumbnail" alt="...">\n' +
                '                <div class="card-body">\n' +
                '<a onclick="deletePhoto(this.parentElement)" class="btn btn-danger">Supprimer</a>' +
                '<a href="#" onclick="afficherPhoto(this.parentElement)" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">Afficher</a>' +
                '                </div>\n' +
                '            </div>\n' +
                '        </div>'
            )
            ;
        } else {
            clearphoto();
        }
    }


    window.addEventListener('load', startup, false);
})();

function deletePhoto(element) {
    element.parentElement.parentElement.remove();
}

function afficherPhoto(element) {
    var src = element.previousElementSibling;
    photo = document.getElementById('photo');
    photo.setAttribute('src', src.getAttribute('src'));
    console.log(src.getAttribute('src'));
}