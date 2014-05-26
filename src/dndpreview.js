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
    var defaults = {
        holderSelector: '.holder',
        acceptedTypes: {
            'image/png': true,
            'image/jpeg': true,
            'image/gif': true
        }
    }, settings,
        holder,
        tests = {
            filereader: (typeof FileReader !== 'undefined'),
            dnd: document.createElement('span').hasOwnProperty('draggable')
        },
        fileupload = document.getElementById('upload');
    
    
    function previewfile(event) {
        var image = new Image();
        image.src = event.target.result;
        image.width = 250; // a fake resize
        while (holder.firstChild) { //remove previus if any
            holder.removeChild(holder.firstChild);
        }
        holder.appendChild(image);
    }

    function readfiles(file) {
        if (tests.filereader === true) {
            if (settings.acceptedTypes[file.type] !== true) {
                return false;
            }
            var reader = new FileReader();
            reader.onload =  previewfile;
            reader.readAsDataURL(file);
        } else {
            holder.innerHTML += '<p>Uploaded ' + file.name + ' ' + (file.size ? (file.size / 1024 | 0) + 'K' : '');
        }
    }
    function ini(options) {
       
        // junta los defaults con las opciones
        settings = $.extend(defaults, options);
        holder = $(settings.holderSelector).get(0);
        //valida que tenga soporte para drang and drop
        holder.className = 'holder';
        if (tests.dnd) {
            
            holder.ondragover = function () {
                this.className = 'holder hover';
                return false;
            };
            holder.ondragend = function () {
                this.className = 'holder';
                return false;
            };
            holder.ondrop = function (e) {
                this.className = 'holder';
                e.preventDefault();
                readfiles(e.dataTransfer.files[0]);
            };
        } else {
            fileupload.className = 'hidden';
            fileupload.querySelector('input').onchange = function () {
                if (this.files > 0) {
                    readfiles(this.files[0]);
                }
            };
        }
    }
    
    $.fn.dndPreview = ini;
}(jQuery));