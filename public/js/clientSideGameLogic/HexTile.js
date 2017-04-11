
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



    getPlayersAroundByBuildings = function(hexTile, map){
        let stealable = [];
        //get players who have one or more settlements/cities on the vertice of that hextile.
        if(hexTile){
        for (let vertex in hexTile.vertices) {
            if (hexTile.vertices.hasOwnProperty(vertex)) {
                //there is a builidng on the vertex
                let building = map.getVertexInfo(hexTile.vertices[vertex]);
                if (building){
                    let player = building.owner;
                    if (player.name != DATA.getMyPlayer().name) stealable.push(player);
                }
            }
        }
      }
        return stealable;
    };




    getPlayersAroundByShips = function(hexTile, map){
        let stealable = [];
        //get players who have one or more settlements/cities on the vertice of that hextile.
        for (let e in hexTile.edge) {
            if (hexTile.edge.hasOwnProperty(e)) {
                //there is a builidng on the vertex
                let ship = map.getEdgeInfo(hexTile.edge[e]);
                if (ship){
                    let player = ship.owner;
                    if (player.name != DATA.getMyPlayer().name) stealable.push(player);
                }
            }
        }
        return stealable;
    };



    /**
     * get valid commands at edge
     * @param hexTileID {int}
     */
    function getCommands(hexTileID) {
        let map = DATA.getMap();
        let cmds = [];
        if (app.ongoingCmd == "moveThief"){
            if (_.contains(app.ongoingCmdData, "robber")) cmds.push('moveRobber');
            if (_.contains(app.ongoingCmdData, "pirate")) cmds.push('movePirate');
            return cmds;
        }

        return cmds;
        // return HexCommand;
    }

    return {
        addHelperFunctions,
        getCommands,
        getPlayersAroundByBuildings,
        getPlayersAroundByShips
    }
})();
