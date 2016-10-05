
function ringLoader(div, size, color) {
    div.css('width', size)
       .css('height', size)
       .addClass('ring-loader')
       .html('<div style="box-shadow: 0 2px 0 0 '+color+' !important;"></div>');
}

function cubeLoader(div, size, color) {
    div.css('width', size)
       .css('height', size)
       .addClass('cube-loader')
       .html('<div style="background:' + color + ' !important;"></div>'
            + '<div style="background:' + color + ' !important;"></div>'
            + '<div style="background:' + color + ' !important;"></div>'
            + '<div style="background:' + color + ' !important;"></div>');
}