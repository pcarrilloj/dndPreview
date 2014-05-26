/**
 * unit test para la libreria dndPreview
 * @autor pcarrillo
 */

/*jslint browser: true */
/*jslint bitwise: true */
/*global module, form, test, pdp, $ */

module("dndPreview", {
});

test("focustxtbox", function () {
    $("#dnd").dndPreview();
});