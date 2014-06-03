/**
 * unit test para la libreria dndPreview
 * @autor pcarrillo
 */

/*jslint browser: true */
/*jslint bitwise: true */
/*global module, form, test, asyncTest, start, $, equal, ok, Blob, sinon */


function fireCustomEvent(eventName, element, data) {
    'use strict';
    var event;
    data = data || {};
    if (document.createEvent) {
        event = document.createEvent("HTMLEvents");
        event.initEvent(eventName, true, true);
    } else {
        event = document.createEventObject();
        event.eventType = eventName;
    }

    event.eventName = eventName;
    event = $.extend(event, data);

    if (document.createEvent) {
        element.dispatchEvent(event);
    } else {
        element.fireEvent("on" + event.eventType, event);
    }
}

module("dndPreview", {
});

test("focustxtbox", function () {
    'use strict';
    function testDom() {
        var actual;
        $("#dnd").dndPreview();
        equal($("#dnd > .holder").length, 1, "se esperaba un elemento con la clase holder");
    }
    testDom();
});

test("eventHandlers", function () {
    'use strict';
    function testDragEvents() {
        $("#dnd").dndPreview();
        equal($("#dnd > div").length, 1, "se esperaba un elemento con la clase holder");
        fireCustomEvent('dragover', $("#dnd > div").get(0));
        ok($("#dnd > div ").hasClass("holder"), "se esperaba tuviera la clase holder");
        ok($("#dnd > div ").hasClass("hover"), "se esperaba tuviera la clase hover");
        fireCustomEvent('dragend', $("#dnd > div").get(0));
        ok($("#dnd > div ").hasClass("holder"), "se esperaba tuviera la clase holder");
        ok(!$("#dnd > div ").hasClass("hover"), "se esperaba no tuviera la clase hover");
    }
    testDragEvents();
});

test("fallback", function () {
    'use strict';
    function testFormCreated() {
        var config, $form;
        config = {fallback : true, //force fallback
                  remote: "/dev/null"
                 };
        $("#dnd").dndPreview(config);
        equal($("#dnd > div").length, 0, "se no tuviera div");
        equal($("#dnd > form ").length, 1, "se esperaba tuviera un elemento form");
        $form = $("#dnd > form ");
        equal($form.attr('action'), "/dev/null", "se esperaba un action = /dev/null");
        equal($("#dnd > form > input").length, 1, "se esperaban 2 inputs en el form");
        equal($("#dnd > form > Button").length, 1, "se esperaban 2 inputs en el form");
        equal($("#dnd > form > :file").length, 1, "se esperaban 1 input file en el form");
        equal($("#dnd > form > :submit").length, 1, "se esperaban 1 input submit en el form");
        
    }
    testFormCreated();
});

module("dndPreviewServerComunication", {
    setup: function() {
        this.server = sinon.fakeServer.create();
    },
    teardown: function() {
        this.server.restore();        
        delete this.server;
    }
});

asyncTest("previewOnDrop", function () {
    'use strict';
    expect(2);
    var server = this.server,
        config,
        mockedfile;
    config = {
        remote: "/fileupload",
        fileReaded: function () {
            equal($('#dnd > div > img').length, 1, "se esperaba un elemento de imagen");
            start();
        }
    };
    $("#dnd").dndPreview(config);
    
    //uso un blob como un mock de file 
    //refer http://www.nczonline.net/blog/2012/06/05/working-with-files-in-javascript-part-5-blobs/
    mockedfile = new Blob(["Hello world!"], { type: "image/jpeg" });
    equal(mockedfile.type, "image/jpeg");
    fireCustomEvent('drop', $("#dnd > div").get(0), {dataTransfer: {files: [mockedfile]}});
});

test("xhrOndrop", function () {
    'use strict';
    var config,
        mockedfile;
    equal(this.server.requests.length, 0, "se esperaba que se hiciera un request");
    this.server.respondWith("GET", "/fileupload",
                   [200, { "Content-Type": "application/json" },
                    '[{ id: 12, comment: "Hey there" }]']);
    config = {
        remote: "/fileupload"
    };
    $("#dnd").dndPreview(config);
    
    //uso un blob como un mock de file 
    //refer http://www.nczonline.net/blog/2012/06/05/working-with-files-in-javascript-part-5-blobs/
    mockedfile = new Blob(["Hello world!"], { type: "image/jpeg" });
    equal(mockedfile.type, "image/jpeg");
    //ref http://jsfiddle.net/pcarrilloj/M38ef/3/
    equal(this.server.requests.length, 1, "se espera un request que se hace como test");
    fireCustomEvent('drop', $("#dnd > div").get(0), {dataTransfer: {files: [mockedfile]}});
    this.server.respond();
    equal(this.server.requests.length, 2, "se esperaba que se hiciera un request real y uno de pruebas");
    
});