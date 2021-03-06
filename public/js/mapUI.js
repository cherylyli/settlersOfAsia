let mapUI = (function () {
    let vertexRadius = 6;
    let edgeWidth = 5;

    /**
     * populate the base map based on the map object
     */
    function initializeGame() {
        //initialize map
        generateHexDivs();
        generateVertices();
        positionMap();
        placeHarbors();
        putFishTiles();
        placeRobberAndPirate();
        //setUpUtils();

        changePlayerColors();
        UIinitialized = true;
    }

    function resizeMap() {

        /**
         let p1 = new Promise(
         (resolve, reject) => {
                positionMap();
                resolve();
            }
         );
         p1.then(
         function() {
                placeRoadsAndShips();
                placeHarbors();
            });
         **/

        positionMap();
        placeRobberAndPirate();
        placeRoadsAndShips();
        placeHarbors();
        putFishTiles();
    }

    function updateMap() {
        placeRobberAndPirate();
        placeRoadsAndShips();
        addVertexUnit();
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

        $('.hex').remove();

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
                if (hextile.type == Enum.HexType.Lake) {
                    $numToken.css('width', 65);
                }
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

    function calculateHexSize() {
        let $map = $('.map');
        // calculate hexTile height
        let hexHeight = ($map.height()) / (DATA.getMap().row.length * 0.75 + 0.75);
        let hexWidth = 0.866 * hexHeight;
        // hexagon height to width ratio: 2 : 3^(1/2)
        let hexEdgeLength = hexHeight / 2;
        return [hexHeight, hexWidth, hexEdgeLength];
    }


    function positionMap() {
        let $map = $('.map');
        let [hexHeight, hexWidth, hexEdgeLength] = calculateHexSize();

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

            // console.log(hex.id, "HEXtop", $hex.position().top, top, $hex.position().left, left);

            // set width and height of hex
            $hex.width(hexWidth).height(hexHeight);

            // position vertices
            // FIXME: there are duplicate assignments here, but I am not sure how to improve

            //let vertexRadius = 6;
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

        //if ()

        //placeHarbors();

        // hexLength = $map.find('.vertex[data-id=1]').position().top - $map.find('.vertex[data-id=11]').position().top;
    }


    function placeRobberAndPirate() {
        let $map = $('.map');
        let map = DATA.getMap();

        // repaint preparation
        $('.thief').remove();


        let thiefs = ['robber', 'pirate'];

        _.forEach(thiefs, function (thief) {
            if (map[thief].pos != 0) {
                let $hex = $map.find('.hex[data-id=' + map[thief].pos + ']');
                let $thief = $("<div class='thief'></div>");
                $thief.addClass(thief);
                $hex.append($thief);
            }
        });

    }

    function putFishTiles() {
        let $map = $('.map');
        let map = DATA.getMap();

        // repaint
        $('.fish-tile').remove();
        let [hexHeight, hexWidth, hexEdgeLength] = calculateHexSize();

        let fishTiles = map.fishTiles;
        _.forEach(fishTiles, function (fishTile) {
            let $fishTile = $("<div class='fish-tile'></div>");
            $fishTile.attr({
                'data-id': fishTile.id
            });
            let tempTiles = map.getHexTileByEdge(Map.edge(fishTile.vertices['1'], fishTile.vertices['2']));
            let hextileID, positionInHex;
            _.forEach(tempTiles, function (temp) {
                if (DATA.getHexTileById(temp[0]).type != Enum.HexType.Sea) {
                    [hextileID, positionInHex] = temp;
                }
            });
            let hextile = map.getHexTileById(hextileID);
            let $hexTile = $map.find('.hex[data-id=' + hextile.id + ']');


            // the center of the harbor circle
            let centerX, centerY;
            let top = parseInt($hexTile.css('top'));
            let left = parseInt($hexTile.css('left'));
            let right = left + 1.732 * hexEdgeLength;
            let bottom = top + 2 * hexEdgeLength;
            let harborRadius = hexEdgeLength * 0.6 / 2;
            switch (positionInHex) {
                case 'TopLeft':
                    centerX = left;
                    centerY = top - 0.5 * hexEdgeLength;
                    break;
                case 'TopRight':
                    centerX = right;
                    centerY = top - 0.5 * hexEdgeLength;
                    break;
                case 'Right':
                    centerX = right + 0.866 * hexEdgeLength;
                    centerY = top + hexEdgeLength;
                    break;
                case 'BottomRight':
                    centerX = right;
                    centerY = bottom + 0.5 * hexEdgeLength;
                    break;
                case 'BottomLeft':
                    centerX = left;
                    centerY = bottom + 0.5 * hexEdgeLength;
                    break;
                case 'Left':
                    centerX = left - 0.866 * hexEdgeLength;
                    centerY = top + hexEdgeLength;
            }

            $fishTile.css({
                'width': harborRadius * 2,
                'height': harborRadius * 2,
                'top': centerY - harborRadius,
                'left': centerX - harborRadius
            });

            $fishTile.text(fishTile.productionNum);


            $map.append($fishTile);
        })
    }

    function placeHarbors() {
        let $map = $('.map');
        let map = DATA.getMap();

        // repaint
        $('.harbor').remove();
        let [hexHeight, hexWidth, hexEdgeLength] = calculateHexSize();

        let harbors = map.harbors;

        _.forEach(harbors, function (harbor) {
            let $harbor = $("<div class='harbor'></div>");
            $harbor.attr({
                'data-id': harbor.position,
                'data-type': harbor.type
            });

            let [hextileID, positionInHex] = map.getHexTileByEdge(harbor.position)[0];
            let hextile = map.getHexTileById(hextileID);
            let $hexTile = $map.find('.hex[data-id=' + hextile.id + ']');


            // the center of the harbor circle
            let centerX, centerY;
            // let top = parseInt($hexTile.css('top'));
            // let left = parseInt($hexTile.css('left'));
            let top = parseInt($hexTile.css('top'));
            let left = parseInt($hexTile.css('left'));
            /**
             console.log(hextile.id, "left", left);
             console.log(hextile.id, "top", top);
             **/
            let right = left + 1.732 * hexEdgeLength;
            let bottom = top + 2 * hexEdgeLength;
            let harborRadius = hexEdgeLength * 0.6 / 2;
            switch (positionInHex) {
                case 'TopLeft':
                    centerX = left + 0.5 * 0.7 * 0.866 * hexEdgeLength;
                    centerY = top - 0.5 * hexEdgeLength + 0.866 * 0.7 * 0.866 * hexEdgeLength;
                    break;
                case 'TopRight':
                    centerX = right - 0.5 * 0.7 * 0.866 * hexEdgeLength;
                    centerY = top - 0.5 * hexEdgeLength + 0.866 * 0.7 * 0.866 * hexEdgeLength;
                    break;
                case 'Right':
                    centerX = right + harborRadius;
                    centerY = top + hexEdgeLength;
                    break;
                case 'BottomRight':
                    centerX = right - 0.5 * 0.7 * 0.866 * hexEdgeLength;
                    centerY = bottom + 0.5 * hexEdgeLength - 0.866 * 0.7 * 0.866 * hexEdgeLength;
                    break;
                case 'BottomLeft':
                    centerX = left + 0.5 * 0.7 * 0.866 * hexEdgeLength;
                    centerY = bottom + 0.5 * hexEdgeLength - 0.866 * 0.7 * 0.866 * hexEdgeLength;
                    break;
                case 'Left':
                    centerX = left - harborRadius;
                    centerY = top + hexEdgeLength;
            }

            $harbor.css({
                'width': harborRadius * 2,
                'height': harborRadius * 2,
                'top': centerY - harborRadius,
                'left': centerX - harborRadius
            });

            $harbor.text(harbor.type.charAt(0));


            $map.append($harbor);

        })


    }

    function getHarborText(harbor) {
        let type = harbor.type;
    }

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

    function addVertexUnit() {
        let $map = $('.map');
        // repaint preparation
        $map.find(".vertex-unit").remove();


        _.forEach(DATA.getMap().vertexInfo, function (vertexUnit) {
            // TODO: change this later for knight, use vertexUnit

            if (vertexUnit) {    //some may be null
                Building.addHelperFunctions(vertexUnit);

                let $vertex = $map.find('.vertex[data-id=' + vertexUnit.position + ']');
                let backgroundPic = "../img/room/finalIcons/" + VertexUnit.getUIType(vertexUnit) + ".png";
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

                if (VertexUnit.isKnight(vertexUnit)) {
                    setUpKnight(vertexUnit, $vertexUnit);
                }

                else if (vertexUnit.level != Enum.Building.Settlement) {
                    // for city, check if it has city wall
                    if (vertexUnit.cityWall) {
                        $vertexUnit.css({
                            'border-width': 3,
                            'border-color': '#6a6b93'
                        });
                    }
                }

                $vertex.append($vertexUnit);

            }
        });
    }


    /**
     *
     * @param knight {VertexUnit} knight object
     * @param $vertexUnit
     */
    function setUpKnight(knight, $vertexUnit) {
        $vertexUnit.addClass('knight');
        if (!knight.active) $vertexUnit.css('opacity', 0.4);
        $vertexUnit.css({
            'border-width': (knight.level - 1) * 3,
            'border-color': '#6a6b93',
        })
    }

    function placeRoadsAndShips() {
        let $map = $('.map');
        // repaint preparation
        $map.find(".edge-unit").remove();


        let edgeInfo = DATA.getMap().edgeInfo;
        for (let edgeKey in edgeInfo) {
            if (edgeInfo.hasOwnProperty(edgeKey)) {
                if (!edgeInfo[edgeKey]) continue;
                let [vertex1, vertex2] =  Map.getEdgeByEdgeKey(edgeKey);
                let $edgeUnit = $("<div class='edge-unit'></div>");
                let edgeUnit = edgeInfo[edgeKey];

                $map.append($edgeUnit);
                $vertex1 = $map.find('.vertex[data-id=' + vertex1 + ']');
                $vertex2 = $map.find('.vertex[data-id=' + vertex2 + ']');
                let v1L = parseInt($vertex1.css("left"));
                let v1T = parseInt($vertex1.css("top"));
                let v2L = parseInt($vertex2.css("left"));
                let v2T = parseInt($vertex2.css("top"));
                let divLeft = v1L < v2L ? v1L : v2L;
                let divTop = v1T < v2T ? v1T : v2T;

                $edgeUnit.attr({
                    'id': edgeKey,
                    'data-type': edgeUnit.type,
                    // 'left': divLeft,
                    // 'top': divTop,
                });

                let width = Math.abs(v1L - v2L);

                $edgeUnit.css({
                    'left': width > 0 ? divLeft + vertexRadius : divLeft + vertexRadius - edgeWidth / 2,
                    'top': divTop + vertexRadius,
                    'width': width > 0 ? width : 10,
                    'height': Math.abs(v1T - v2T),
                    'position': 'absolute',
                    'z-index': 1
                });

                let draw = SVG(edgeKey);
                let x1 = width > 0 ? v1L - divLeft : v1L - divLeft + edgeWidth / 2;
                let y1 = v1T - divTop;
                let x2 = width > 0 ? v2L - divLeft : v2L - divLeft + edgeWidth / 2;
                let y2 = v2T - divTop;
                let line = draw.line(x1, y1, x2, y2).stroke({
                    width: edgeWidth,
                    color: Enum.CSSColors[edgeUnit.owner.color]

                });

                if (edgeUnit.type == "ship") {
                    line.attr({
                        'stroke-linecap': 'round',
                        'stroke-dasharray': '1, 7'
                    })
                }

            }
        }
    }


    // public methods
    return {
        initializeGame,
        positionMap,
        placeRoadsAndShips,
        resizeMap,
        addVertexUnit,
        updateMap,

    }

})();


//-------------------------map action-------------------------
// test if control key is pressed
function isCtrlPressed(e) {
    return e.ctrlKey || e.metaKey;
}

// clear highlighted vertices
function clearHighlightedVertices($except) {
    var $p = $('#cmd-table');
    var $map = $('#board .map');
    $map.find('.vertex').not($except).removeClass('ctrl-clicked');
}

// clear highlighted hexes
function clearHighlightedHexes($except) {
    var $p = $('#cmd-table');
    var $map = $('#board .map');
    $map.find('.hex').not($except).removeClass('clicked');
}

// clear highlighted commands
function clearHighlightedCommands() {
    var $p = $('#cmd-table');
    //var $map = $('#board .map');
    $p.find('.cmds .cmd').removeClass('matched'); // remove highlighted commands
}

// count number of highlighted vertices
function highlightedVertices() {
    return $('#board .map .vertex.ctrl-clicked').length;
}

// count number of highlighted hexes
function highlightedHexes() {
    return $('#board .map .hex.clicked').length;
}

// highlight a vertex
function highlightVertex($e) {
    $e.addClass('ctrl-clicked');
}

// highlight a hex
function highlightHexes($e) {
    $e.addClass('clicked');
}

// check if element has class
function isNot($e, cls) {
    return (!$e.hasClass(cls) && !$e.closest('.' + cls).length);
}



