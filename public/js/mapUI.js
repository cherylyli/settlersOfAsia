/**
 * Created by emol on 3/7/17.
 */
let mapUI = {};

/**
 * populate the base map based on the map object
 */
mapUI.populate_base_game = function() {
    generateHexDivs();
    generateVertices();
    this.positionMap();
};

// generate vertex divs without positioning
function generateVertices() {
    let $map = $('.map');
    let lastHexID = DATA.getMap().hexTileNum;
    let lastVertexID = DATA.getMap().getHexTileById(lastHexID).vertices.BottomRight;

    for (let vertexID = 1; vertexID <= lastVertexID; vertexID++){
        let $vertex = $("<div class='vertex'></div>");

        $vertex.attr({
            'data-id': vertexID
        });

        $map.append($vertex);
    }

}

// generate hex divs without positioning
function generateHexDivs() {
    let $map = $('.map');

    for (let hextile of DATA.getMap().hexTiles) {
        let $hex = $("<div class='hex'></div>");

        // hex attributes
        $hex.attr({
            'data-type': hextile.type,
            'production-num': hextile.productionNum,
            'data-id': hextile.id,
            'data-row': hextile.row,
            'data-positionInRow': hextile.posInRow
        });

        // put number token on top of div -> only for land tiles
        if (hextile.productionNum){
            let $numToken = $("<div class='num-token'></div>");
            $numToken.text(hextile.productionNum);
            $hex.append($numToken);
        }


        // hex positions
        let backgroundPic = "../img/room/tiles/" + hextile.type + ".png";
        $hex.css({
            // background pic
            'background': 'url(' + backgroundPic + ')',
            'background-size': '100%',
        });


        $map.append($hex);
    }

}


mapUI.positionMap = function () {
    let $map = $('.map');
    // calculate hexTile height
    let hexHeight =  ($map.height()) / (DATA.getMap().row.length * 0.75 + 0.75);
    let hexWidth = 0.866 * hexHeight;
    // hexagon height to width ratio: 2 : 3^(1/2)

    let map = DATA.getMap();
    $('.hex').each(function() {
        let $hex = $(this);

        let hex = map.getHexTileById($hex.attr('data-id'));
        // position hexes
        let top = (hex.row - 1) * hexHeight * 0.75;
        let left = ((7 - DATA.getMap().row[hex.row - 1]) * hexWidth / 2 + (hex.posInRow - 1) * hexWidth);
        $hex.css({
            'top': top,
            'left': left,
        });
        // set width and height of hex
        $hex.width(hexWidth).height(hexHeight);

        // position vertices
        // FIXME: there are duplicate assignments here, but I am not sure how to improve

        //-------------------WILL CHANGE THIS PART TMR------------
        $map.find('.vertex[data-id=' + hex.vertices.TopLeft + ']').css({
            'top': top + 0.25 * hexHeight - 2.5,
            'left': left - 2.5
        });
        $map.find('.vertex[data-id=' + hex.vertices.Top + ']').css({
            'top': top - 2.5,
            'left': left + 0.5 * hexWidth - 2.5
        });
        $map.find('.vertex[data-id=' + hex.vertices.TopRight +']').css({
            'top': top + 0.25 * hexHeight - 2.5,
            'left': left + hexWidth - 2.5
        });
        $map.find('.vertex[data-id=' + hex.vertices.BottomLeft + ']').css({
            'top': top + 0.75 * hexHeight - 2.5,
            'left': left - 2.5
        });
        $map.find('.vertex[data-id=' + hex.vertices.Bottom + ']').css({
            'top': top + hexHeight - 2.5,
            'left': left + 0.5 * hexWidth - 2.5
        });
        $map.find('.vertex[data-id=' + hex.vertices.BottomRight+ ']').css({
            'top': top + 0.75 * hexHeight - 2.5,
            'left': left + hexWidth - 2.5
        });
        //---------------------------------------------------------
    });
};



/**
 *
 * @param hextile   {HexTile}
 * @param hexHeight {int}   the height/ width of the hextile
 * @param top   {int}   position TOP of the hextile
 * @param left  {int}   position LEFT of the hextile
 */
function setUpVertices(hextile, hexHeight, top, left) {
    //let $map = $('#board .map');

}





