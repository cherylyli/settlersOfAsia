/**
 * Created by emol on 3/7/17.
 */
let mapUI = {};
/**
 * populate the base map based on the map object
 */
mapUI.populate_base_game = function() {
    generateHexDivs();
};

function generateHexDivs() {
    let borderSpace = 40;
    // calculate hexTile height
    let hexHeight = ($('#board .map').height() - borderSpace)/DATA.getMap().row.length;
    let hexWidth = hexHeight * 1.1547; //hexagon width to heigth ratio: 2 : 3^(1/2)
    let $map = $('#board .map');

    for (let hextile of DATA.getMap().hexTiles) {
        let $hex = $("<div class='hex'></div>");

        // hex attributes
        $hex.attr({
            'data-type': hextile.type,
            'production-num': hextile.productionNum,
            'data-id': hextile.id
        });

        // put number token on top of div
        // $hex.text(hextile.productionNum);

        // hex positions
        let top = (hextile.row - 1) * hexHeight;
        let left = ((7 - DATA.getMap().row[hextile.row - 1]) * hexWidth / 2 + (hextile.posInRow - 1) * hexWidth);
        //let backgroundPic = "../img/room/tiles/" + hextile.type + ".png";
        $hex.css({
            //position
            'top': top,
            'left': left,
            //background pic
            //'background': 'url(' + backgroundPic + ')',
            //'background-size': '100%',
            //'z-index': 0
        });

        //setUpVertices(hextile, hexHeight, top, left);

        $map.append($hex);
    }

    // set width and height of hex
    $('#board .map .hex').width(hexWidth).height(hexHeight);
}

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





