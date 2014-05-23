/**
*
*  Precarga de Imágenes
*
**/

/*jslint browser: true */
/*jslint bitwise: true */
/*global jQuery, FileReader*/

//clousure
(function ($) {
    'use strict';
    var holder = document.getElementById('holder'),
        tests = {
            filereader: typeof FileReader !== 'undefined',
            dnd: document.createElement('span').hasOwnProperty('draggable')
        },
        support = {
            filereader: document.getElementById('filereader')
        },
        acceptedTypes = {
            'image/png': true,
            'image/jpeg': true,
            'image/gif': true
        },
        fileupload = document.getElementById('upload'),
        apis = "filereader";
    
    apis.split(' ').forEach(function (api) {
        if (tests[api] === false) {
            support[api].className = 'fail';
        }
    });

    function previewfile(file) {
        if (tests.filereader === true && acceptedTypes[file.type] === true) {
            var reader = new FileReader();
            reader.onload = function (event) {
                var image = new Image();
                image.src = event.target.result;
                image.width = 250; // a fake resize
                while (holder.firstChild) { //remove previus if any
                    holder.removeChild(holder.firstChild);
                }
                holder.appendChild(image);
            };

            reader.readAsDataURL(file);
        } else {
            holder.innerHTML += '<p>Uploaded ' + file.name + ' ' + (file.size ? (file.size / 1024 | 0) + 'K' : '');
        }
    }

    function readfiles(files) {
        if (files.length === 1) {
            previewfile(files[0]);
        } else if (files.length > 1) {
            $("#message").html("solo se puede subir un documento");
        }
    }

    if (tests.dnd) {
        holder.ondragover = function () { this.className = 'hover'; return false; };
        holder.ondragend = function () { this.className = ''; return false; };
        holder.ondrop = function (e) {
            this.className = '';
            e.preventDefault();
            readfiles(e.dataTransfer.files);
        };
    } else {
        fileupload.className = 'hidden';
        fileupload.querySelector('input').onchange = function () {
            readfiles(this.files);
        };
    }
}(jQuery, this.pdp));