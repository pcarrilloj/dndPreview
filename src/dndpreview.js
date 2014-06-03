/**
*
*  Precarga de Imágenes
*
**/

/*jslint browser: true */
/*jslint bitwise: true */
/*global jQuery, FileReader, FormData*/

//clousure
(function ($) {
    'use strict';
    
    $.fn.dndPreview = function (options) {
       
        /**
        * class private vars
        */
        var defaults = { //default configs
            acceptedTypes: {
                'image/png': true,
                'image/jpeg': true,
                'image/gif': true
            },
            fallback: false,
            remote: '/devnull.php',
            fileReaded: null, //functin callback
            fileUploaded: null, //functin callback
            textSendButton: "Subir imagen", //solo para el fallback
            message:"arrastra y suelta una imagen al recuadro",
            extraData:{} //json extra data to post
        },
            $self = this,//referencia de el contexto para las funciones internas 
            settings, //actual config
            holder, 
            tests = { //tests for browser capabilities 
                filereader: typeof FileReader !== 'undefined',
                dnd: 'draggable' in document.createElement('span'),
                formdata: !!window.FormData,
                progress: new XMLHttpRequest().hasOwnProperty("upload")
            };
        
        /**
        * send file to the remote ulr
        */
        function upload(file) {
            var formData, xhr;
            if (!tests.formdata) {
                return;
            }
            formData = new FormData();
            formData.append('file', file);
            
            xhr = new XMLHttpRequest();
            xhr.open('POST', settings.remote);
            xhr.on
            xhr.onload = function () {
                //progress.value = progress.innerHTML = 100;
                if (typeof settings.fileUploaded === 'function') {
                    settings.fileUploaded();
                }
            };
            /*
            if (tests.progress) {
                xhr.upload.onprogress = function (event) {
                    if (event.lengthComputable) {
                        var complete = (event.loaded / event.total * 100 | 0);
                        progress.value = progress.innerHTML = complete;
                    }
                };
            }*/

            xhr.send(formData);
        }
        /**
        *Shows the image file inside the holder div
        */
        function previewfile(event) {
            
            var image = document.createElement('img'),
                $holder = $self.find('.holder');
            image.src = event.target.result;
            image.width = $holder.width(); // a fake resize
            $holder.empty(); //remove prev if any
            $holder.append(image);
            
            if (typeof settings.fileReaded === 'function') {
                settings.fileReaded();
            }
        }
        
        /**
        * creates a file reader and atach the 
        * previewfile to the onload event of the reader
        */
        function readfiles(file) {
            if (settings.acceptedTypes[file.type] !== true) {
                return false;
            }
            var reader = new FileReader();
            reader.onload =  previewfile;
            reader.readAsDataURL(file);
            upload(file);
        }
        /**
        * creates the elemt holder 
        * and atach handlers for drag&drop 
        * events
        */
        function setupdnd() {
            $self.html("<div><p>"+settings.message+"</p></div>");
            $self.find("div").addClass('holder');
            holder = $self.find(".holder").get(0);

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
        }
        /**
        * set up the fallback metod for old browsers
        * a simple form with a input file and  send button
        */
        function setupfallback() {
            var formtext;
            
            formtext = "<form action='" + settings.remote + "' method='post'>"
            formtext += "<input type='file' id='file' name='subir archivo'/>"
            /*$.each(settings.extraData,function(i,data){
                
            });*/
            formtext += "<button name='name' value='value' type='submit'>"
            formtext += settings.textSendButton 
            formtext += "</button>"
            
            $self.html(formtext);
        }
        /**
        * start point of the script, extends the setings
        * test the capabilities of the browser for setup the dnd or 
        * the fallback
        */
        function ini() {
            
            // junta los defaults con las opciones
            settings = $.extend(defaults, options);
            //valida que tenga soporte para drang and drop filereader y formdata para trabajar 
            if (tests.dnd && tests.filereader && tests.formdata && settings.fallback === false) {
                setupdnd();
            } else { // en caso de no tener soporte a las apis necesarias hago un fallback a un form normal
                setupfallback();
            }
        }
        
        /**
        *bootstrap the script
        */
        ini();
    };
}(jQuery));