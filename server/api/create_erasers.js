// create eraser .svg files for different size of erasers
var _ = require('underscore');
var fs = require('fs');


// return center, width, radius of a circle given its width
function makeCircle(width){
    width = width + 2;              // boost the width a bit, bcz the actual drawn dot of this width is a bit bigger for some reason
    var border = 1;                 // border width
    var border_color = '#66757f';   // border color
    var fill = width - border * 2;  // the width of filled area (width of the circle, excluding the border)
    if (fill < 0) fill = 0;         // ensure fill is positive
    var r = fill / 2;
    var center = r + border;
    return {
        width       : width,
        border      : border,
        border_color: border_color,
        fill        : fill,
        r           : r,
        center      : center
    };
}


// return the SVG for a circle given its width
function circleSvg(width){
    var c = makeCircle(width);
    return _.template(
        '<svg height="<%=height%>" width="<%=width%>" version="1.1" xmlns="http://www.w3.org/2000/svg">\n' +
        '   <circle cx="<%=cx%>" cy="<%=cy%>" r="<%=r%>" stroke="<%=border_color%>" stroke-width="<%=border%>" fill="transparent" />\n' +
        '</svg>'
    )({
        height: c.width,
        width: c.width,
        cx: c.center,
        cy: c.center,
        r: c.r,
        border: c.border,
        border_color: c.border_color
    });
}


// return the css for a circle cursor
function cursorCss(width){
    var c = makeCircle(width);
    if (width <= 3) return _.template("#whiteboard[data-cursor='eraser'][data-size='<%=width%>']{ cursor: crosshair; }")({
        width: width
    });
    return _.template("#whiteboard[data-cursor='eraser'][data-size='<%=width%>']{ cursor: url('/images/cursor/eraser/<%=width%>.svg') <%=center%> <%=center%>, crosshair; }")({
        width: width,
        center: c.center
    });
}


// return css for different sizes of circle cursor
function cssList(min_width, max_width){
    var html = '';
    for (var i=min_width; i<=max_width; i++){
        html += '\n' + cursorCss(i);
    }
    html = html.replace('\n', '');
    return html;
}


// create SVG eraser files of all sizes between min_size and max_size
function createSvgs(){
    var folder = './public/images/cursor/eraser/';
    var extension = '.svg';
    var min_size = 1;
    var max_size = 50;
    for (var i=min_size; i<=max_size; i++){
        var path = folder + i + extension;
        var html = circleSvg(i);
        fs.writeFileSync(path, html);
        console.log('created svg at:', path);
    }
}



// createSvgs();
// console.log(cssList(1, 50));


