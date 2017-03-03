$(document).ready(function() {

    /**
     * Controls for aligning map
     */

    var hex_width_correction = 5;
    var hex_height_correction = 0;

    var hex_width = 50 - hex_width_correction;
    var hex_height = 50 + hex_height_correction;

    var verticeId = 0;
    var hexId = 0;

    var sizeOfMap = 37; // 37, 44, 51


    function populate_base_game() {
        switch (sizeOfMap) {
            case 37:
                generateHexMap(0);
                break;
            case 44:
                generateHexMap(1);
                break;
            case 51:
                generateHexMap(2);
                break;
            default:
                console.error(new Error('invalid map size'));
                break;
        }
    }

    function getVerticeId() {
        verticeId++;
        return verticeId;
    }

    function getHexId() {
        hexId++;
        return hexId;
    }


    function generateHexMap(delta1) {
        for (var j = 0; j < 4; j++) {
            createAndPlaceAtLocation(hex_width * j, ((3 - j) * (hex_height / 2.0)), getHexId());
            if (j == 3) {
                createVertice(hex_width * j + 188 + "px", ((3 - j) * (hex_height / 2.0)) + "px", getVerticeId());
            }
        }


        for (var j = 0; j < 5; j++) {
            createAndPlaceAtLocation(hex_width * j, ((5 - j) * (hex_height / 2.0)), getHexId());
            if (j == 4) {
                createVertice(hex_width * j + 223 + "px", ((5 - j) * (hex_height / 2.0)) + 24 +  "px", getVerticeId());
            }
        }


        for (var j = 0; j < 6; j++) {
            createAndPlaceAtLocation(hex_width * j, ((7 - j) * (hex_height / 2.0)), getHexId());
            if (j == 5) {
                createVertice(hex_width * j + 215 + hex_width + "px", ((7 - j) * (hex_height / 2.0)) + 50+ "px", getVerticeId());
            }
        }

        //Places hexes after three diagonal lines
        for (var k = 0; k < 4 + delta1; k++) {
            for (var j = 0; j < 7; j++) {
                if (j >= k - delta1) {
                    createAndPlaceAtLocation(hex_width * j, ((7 + (2 * (k + 1)) - j) * (hex_height / 2.0)), getHexId());
                    if (j == 6) {
                        createVertice(hex_width * j + hex_width  + 253 + "px", ((9 + (2 * k) - j) * hex_height) + "px", getVerticeId());
                    }
                    if (k > 0 && j == 6) {
                        createVertice(hex_width * j  + hex_width + 273 +  hex_width_correction + "px", (((9 + (2 * k) - j) - 1) * hex_height) + "px", getVerticeId());
                    }
                } else if (j == k - delta1 - 1) {
                    createVertice(hex_width * j*1.77 + 28 + "px", ((9 + (2 * k) - j) * hex_height) +3+ "px", getVerticeId());
                }
            }
        }

        //Places vertices below on the last diagonal line of hexes
        for (var i = 0; i < 4; i++) {
            createVertice(hex_width * i*1.77 + 272 + "px", ((14 + (delta1 * 2) - i) * hex_height ) + 3+ "px", getVerticeId());
            createVertice(hex_width * i * 1.77 + 325 + "px", ((14 + (delta1 * 2) - i) * hex_height ) +3 + "px", getVerticeId());
            if (i == 3) {
                createVertice(hex_width * i + +458 + "px", ((13 + (delta1 * 2) - i) * hex_height) + 1+ "px", getVerticeId());
            }
        }
    }

    function createAndPlaceAtLocation(x, y, id) {
        createVertice(x*1.8  + "px", (y*2.0 + hex_height) + "px", getVerticeId());
        createVertice(x*1.8 + 25 + "px", y*2.0 + "px", getVerticeId());
        

        x = x *1.8+ "px";
        y = y *2.0+ "px";
        var newNode = document.createElement("div");
        newNode.setAttribute("data-id", "" + id);
        newNode.setAttribute("class", "hexagon");
        newNode.style.top = y;
        newNode.style.left = x;
        placeIntoWebpage(newNode);
    }

    function createVertice(x, y, id) {
        var vertice = document.createElement("div");
        vertice.setAttribute("data-id", "" + id);
        vertice.setAttribute("class", "vertice");
        vertice.style.top = y;
        vertice.style.left = x;
        placeIntoWebpage(vertice);
    }

    function placeIntoWebpage(newNode) {
        $('#board .map').append(newNode);
    }



    



    // generate map
    populate_base_game();






});