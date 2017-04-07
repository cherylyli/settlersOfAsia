
let HexTile = (function () {
    function addHelperFunctions (hexTile) {

        hexTile.getVertices = function(){
            return hexTile.vertices;
        };

        /**
         * find the edge position in hex
         * @param edge
         * @returns string / undefined
         */
        hexTile.getEdgePositionInHex = function(edge){

            if (_.isEqual(edge, hexTile.edge.BottomLeft)){
                return 'BottomLeft';
            }
            if (_.isEqual(edge, hexTile.edge.Left)){
                return 'Left';
            }
            if (_.isEqual(edge, hexTile.edge.TopLeft)){
                return 'TopLeft';
            }
            if (_.isEqual(edge, hexTile.edge.BottomRight)){
                return 'BottomRight';
            }
            if (_.isEqual(edge, hexTile.edge.Right)){
                return 'Right';
            }
            if (_.isEqual(edge, hexTile.edge.TopRight)){
                return 'TopRight';
            }

            return undefined;
        };


        hexTile.getEdges = function(){
            return hexTile.edge;
        };

        return hexTile;
    }


    /**
     * get valid commands at edge
     * @param hexTileID {int}
     */
    function getCommands(hexTileID) {
        let map = DATA.getMap();
        return HexCommand;
    }

    return {
        addHelperFunctions,
        getCommands
    }
})();
