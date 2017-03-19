let mapUI = (function () {
    /**
     * populate the base map based on the map object
     */
    function initializeGame() {
        //initialize map
        generateHexDivs();
        generateVertices();
        positionMap();
        //setUpUtils();

        changePlayerColors();
        UIinitialized = true;
    }

// generate vertex divs without positioning
    function generateVertices() {
        let $map = $('.map');
        let lastHexID = DATA.getMap().hexTileNum;
        let lastVertexID = DATA.getMap().getHexTileById(lastHexID).vertices.BottomRight;

        for (let vertexID = 1; vertexID <= lastVertexID; vertexID++) {
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
            if (hextile.productionNum) {
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


    function positionMap() {
        let $map = $('.map');
        // calculate hexTile height
        let hexHeight = ($map.height()) / (DATA.getMap().row.length * 0.75 + 0.75);
        let hexWidth = 0.866 * hexHeight;
        // hexagon height to width ratio: 2 : 3^(1/2)

        let map = DATA.getMap();
        $('.hex').each(function () {
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

            let vertexRadius = 2.5;
            $map.find('.vertex[data-id=' + hex.vertices.TopLeft + ']').css({
                'top': top + 0.25 * hexHeight - vertexRadius,
                'left': left - vertexRadius
            });
            $map.find('.vertex[data-id=' + hex.vertices.Top + ']').css({
                'top': top - vertexRadius,
                'left': left + 0.5 * hexWidth - vertexRadius
            });
            $map.find('.vertex[data-id=' + hex.vertices.TopRight + ']').css({
                'top': top + 0.25 * hexHeight - vertexRadius,
                'left': left + hexWidth - vertexRadius
            });
            $map.find('.vertex[data-id=' + hex.vertices.BottomLeft + ']').css({
                'top': top + 0.75 * hexHeight - vertexRadius,
                'left': left - vertexRadius
            });
            $map.find('.vertex[data-id=' + hex.vertices.Bottom + ']').css({
                'top': top + hexHeight - vertexRadius,
                'left': left + 0.5 * hexWidth - vertexRadius
            });
            $map.find('.vertex[data-id=' + hex.vertices.BottomRight + ']').css({
                'top': top + 0.75 * hexHeight - vertexRadius,
                'left': left + hexWidth - vertexRadius
            });
        });
    }

    /**
     function setUpUtils() {
        //set up dices
        //$('.dices').show();
    }**/

    // display player color in UI
    function changePlayerColors() {
        // get each player and change color
        let players = app.room.match.players;
        for (var username in players) {
            var color = players[username].color;
            $(`#users .user[data-username="${username}"] .pic .name`).css({
                'background-color': Enum.CSSColors[color]
            });
        }
    }


    // add settlement or city to map UI
    function addSettlementsOrCities() {
        let $map = $('.map');
        _.forEach(DATA.getMap().vertexInfo, function (vertexUnit) {
            // TODO: change this later for knight, use vertexUnit

            if (vertexUnit) {    //some may be null
                Building.addHelperFunctions(vertexUnit);

                let $vertex = $map.find('.vertex[data-id=' + vertexUnit.position + ']');
                let backgroundPic = "../img/room/boardIcons/" + vertexUnit.getUIType() + ".png";
                let $vertexUnit = $("<div class='vertex-unit'></div>");

                /**
                 * TODO: change vertex size to responsive
                 */
                $vertexUnit.css({
                    'position': 'absolute',
                    'top': '-100%',
                    'left': '-100%',
                    'height': '300%',
                    'width': '300%',
                    'background': 'url(' + backgroundPic + ')',
                    'background-size': '100%',
                });

                $vertex.append($vertexUnit);

            }
        });

    }


    function placeRoadsAndShips() {
        let $map = $('.map');
        let edgeInfo = DATA.getMap().edgeInfo;
        for (let edgeKey in edgeInfo) {
            if (edgeInfo.hasOwnProperty(edgeKey)) {
                if (!edgeInfo[edgeKey]) continue;

                let [vertex1, vertex2] =  Map.getEdgeByEdgeKey(edgeKey);
                let edgeUnit = edgeInfo[edgeKey];
                $vertex1 = $map.find('.vertex[data-id=' + vertex1 + ']');
                $vertex2 = $map.find('.vertex[data-id=' + vertex2 + ']');

                $vertex1.connections({
                    to: $vertex2,
                    'class': edgeUnit.type + ' ' + edgeUnit.owner.color
                });
            }
        }
    }


        // public methods
        return {
            initializeGame,
            positionMap,
            addSettlementsOrCities,
            placeRoadsAndShips
        }

    }

    )();
