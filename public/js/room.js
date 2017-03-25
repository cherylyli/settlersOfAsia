// set up environment
$(document).ready(function () {
    var evt = $.Event('imready');

    // Fetch my data from server
    $get('/mydata', function (data) {

        // if not logged in, redirect to login
        if (!data) return window.location.href = '/login';
        evt.myObj = data;

        // show page
        $(window).trigger(evt);
    });
});


// upon environment set up
$(window).on('imready', function (im) {

    $("button").attr('disabled', 'disabled').click(function () {
        // alert("sfd");
        // Commands.exec(CommandName.rollDice, CommandsData.rollDice());
        /**
         let input1 = parseInt($("input[name='input1']").val());
         let input2 = parseInt($("input[name='input2']").val());
         Commands.exec(CommandName.buildEstablishment, CommandsData.buildEstablishment(input1, 1));**/
    });
    //test


    let CircularJSON = window.CircularJSON;

    window.myObj = im.myObj;
    // console.log(window.myObj);
    let roomId = window.location.pathname.split("/").pop();

    // parse a fake room data just for test
    //var room = window.room = {users: []};


    // template for user
    var fakeUser = {
        resourcesAndCommodities: {
            "Lumber": 0,
            "Brick": 0,
            "Grain": 0,
            "Ore": 0,
            "Wool": 0,
            "Gold": 2,
            "Cloth": 0,
            "Coin": 0,
            "Paper": 0
        }
    };

    // on page load, join room
    sock.emit('JOIN_ROOM', roomId);

    // test data
    // for now, assume player choose this map
    let mapConfig = {'scenario': 'Heading For New Shores'};
    sock.emit('MAP_CONFIG', mapConfig);

    // when sock disconnects and reconnects, join room again
    sock.on('reconnect', function () {
        sock.emit('JOIN_ROOM', roomId);
    });

    // upon successfully joined room, server will send back a message
    sock.on('JOIN_ROOM_SUCCESS', function (msg) {
        app.log(myObj.username, 'joined room.', true);
    });


    sock.on('NEW_PLAYER_JOINED', function (msg) {
        app.log(app.room.newUser, 'joined room.', true);
    });


    sock.on('NEW_ROOM_OWNER', function (msg) {
        alert("Now you are the owner of this room!");
        //TODO: maybe gives the room owner some priviledge like setting the map etc
    });

    sock.on('A_PLAYER_LEFT_ROOM', function (msg) {
    });


    sock.on('GAME_START', function (msg) {
        mapUI.initializeGame();
        /**
         swal({
            title: 'GAME START!',
            text: 'Are you prepared?',
            timer: 1000
        });
         app.log(null, 'The game starts.', true);**/
    });

    sock.on('TAKE_TURN', function (msg) {
        app.isMyTurn = true;
        setTimeout(function () {
            swal({
                    title: "TAKE TURN",
                    text: "Hey it's your turn now!",
                    type: "info",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "OK",
                    closeOnConfirm: false,
                },
                function () {
                    if (DATA.getMatch().phase == Enum.MatchPhase.SetupRoundOne) {
                        swal({
                            title: "Set Up Phrase One",
                            text: "Build a settlement by clicking on a vertex. Then build a road by clicking two vertices with CTRL pressed.",
                            type: "info",
                        });
                    }
                    else if (DATA.getMatch().phase == Enum.MatchPhase.SetupRoundTwo) {
                        swal({
                            title: "Set Up Phrase Two",
                            text: "Build a city by clicking on a vertex. Then build a road by clicking two vertices with CTRL pressed.",
                            type: "info",
                        });
                    }
                    else {
                        swal.close();
                    }
                })
        }, 3000);


        // if barbarian attacks
        if (DATA.getMatch().barbarian.result) {
            // apply result
            setTimeout(function () {
                swal({
                    title: "Barbarian Attack",
                    text: "Everybody fights!!!"
                }, function () {
                    if (_.contains(DATA.getMatch().barbarian.result.toPlayers, DATA.getMyPlayer().name)) {
                        app.barbarianResult = true;
                        var action = DATA.getMatch().barbarian.result.result;
                        swal({
                            title: DATA.getMatch().barbarian.result.result,
                            text: Enum.BarbarianAction.action
                    })
                        ;

                        //applyBarbarianAction(DATA.getMatch().barbarian.result.result);

                    }
                    else {
                        swal({
                            title: DATA.getMatch().barbarian.result.result
                        });
                    }
                })

            }, 4000);
        }

    });

    /**
     *
     * @param result {String}
     */
    function applyBarbarianAction(result) {
        switch (result) {
            case Enum.BarbarianResult.CATAN_LOSE:

        }
    }


    // ----------------------------- View Layer ----------------------------- //

    var app = window.app = new Vue({
        el: '#page',
        data: {
            me: myObj,
            my: fakeUser,
            room: room,
            Enum: Enum,
            logs: [
                // { user: null, action: 'The game starts.', system: true },
                // { user: 'Yuan', action: 'places a city.', system: true },
                // { user: 'jack', action: 'places a road.', system: true },
                // { user: 'Max', action: "stop cheating man", system: false },<== Yo I'm no cheater 
                // { user: 'Emol', action: "i aint cheating -_-", system: false }
            ],
            cmds: [
                "buildSettlement", "upgradeToCity", "buildRoad", "buildShip", "buildCityWall", "moveShip", "tradeWithBank", "executeProgressCard"
            ],
            isMyTurn: false,
            barbarianResult: false

        },
        mounted: function () {
            $('body').showV();
            adjustUI();
            console.log('view mounted');
        },
        updated: function () {
            console.log('view updated');
            adjustUI();
        },
        filters: {
            capitalize: beautify.capitalize,
            startCase: function (text) {
                var result = text.replace(/([A-Z])/g, " $1");
                var capped = result.charAt(0).toUpperCase() + result.slice(1);
                return capped;
            }
        },
        watch: {
            room: function () {
                //mapUI.addSettlementsOrCities();

                /**
                 updateHexTiles();
                 addSettlementsOrCities();
                 placeRoadsAndShips();
                 placeHarbors();**/
                //changePlayerColors();
            },

            'room.match': function () {
                mapUI.addVertexUnit();
                mapUI.placeRoadsAndShips();
            }
        },
        methods: {
            call: function (fn) {
                this[fn]();
                hideCmdTable(); // close cmd table
            },

            // save match
            save: function () {
                Toast.show('Saved!');
            },

            // continue previously saved match
            open: function () {
                Toast.show('Open');
            },

            // quit match
            quit: function () {
                Toast.show('Match ended!');
            },

            // append to log
            log: function (user, action, system) {
                this.logs.push({user, action, system});
                NextTick(function () {
                    $('#log .msgs').scrollTop($('#log .msgs')[0].scrollHeight);
                });
            },

            // chat in room
            sendMessage: function () {
                var msg = {
                    action: $('#log input').val()
                };
                sock.emit('send-message', msg);
                $('#log input').val('');
            },

            // send system message
            sendSysMessage: function (words) {
                var msg = {
                    words: words
                };
                sock.emit('send-sys-message', msg);
            },

            endTurn: function () {
                Commands.endTurn();
            },

            // roll dice
            rollDice: function () {
                Commands.rollDice();
            },

            buildSettlement: function () {
                var {vertex} = getInput();
                Commands.buildSettlement(vertex);
            },

            upgradeToCity: function () {
                var {vertex} = getInput();
                Commands.upgradeToCity(vertex);
            },

            executeProgressCard: function(){
                var {card_name} = getInput();
                console.log(card_name);
                Commands.executeProgressCard(card_name);
            },

            /**
             buildEstablishment: function () {
                var {vertex, establishmentLV } = getInput();

                if (establishmentLV == 1){
                    Commands.buildEstablishment(vertex, establishmentLV);
                }
                if (establishmentLV == 2){
                    Commands.buildEstablishment(vertex, establishmentLV);
                };
            },**/

            buildRoad: function () {
                var {vertex1, vertex2} = getInput();
                Commands.buildRoad(vertex1, vertex2);
            },

            buildShip: function () {
                var {vertex1, vertex2} = getInput();
                Commands.buildShip(vertex1, vertex2);
            },

            buyCityImprovement: function () {
                var {category} = getInput();
                var cityImprovementCategory = Enum.cityImprovementCategory[category];
                Commands.buyCityImprovement(cityImprovementCategory);
            },

            buildCityWall: function () {
                var {vertex} = getInput();
                Commands.buildCityWall(vertex);
            },

            moveShip: function () {
                var {oldVertex1, oldVertex2, newVertex1, newVertex2} = getInput();
                Commands.moveShip(oldVertex1, oldVertex2, newVertex1, newVertex2);
            },

            tradeWithBank: function () {
                var {src, tradeFor} = getInput();
                Commands.tradeWithBank(src, tradeFor);
            }

        }
    });

    // adjust UI when resize screen
    function adjustUI() {
        // adjust system log height
        $('#log').outerHeight($('#right-screen').height() - $('#users').outerHeight() - $('#match-opts').outerHeight() - $('#match-state').outerHeight());

        // adjust map size
        if (DATA.getMatch()) mapUI.resizeMap();

        else {
            //waiting pic
            $('#waiting-page img').width($('#board').width());
        }
    }


    $(window).resize(adjustUI);

    // receive chat message
    sock.on('receive-message', function (msg) {
        app.log(msg.user, msg.action, false);
    });

    // receive system message
    sock.on('receive-sys-message', function (msg) {
        var words = msg.words;
        var plural = msg.user != myObj.username;
        var word1 = plural ? pluralize(_.first(words)) : _.first(words);
        var text = `${word1} ${_.rest(words).join(' ')}.`;
        app.log(msg.user, text, true);
    });

    // upon receive an ack, send system message
    _.each(CommandName, function (cmd) {
        sock.on(cmd + 'Ack' + 'Owner', function (msg) {
            var words = cmd.replace(/([A-Z])/g, " $1").toLowerCase().split(' ');
            app.sendSysMessage(words);
        });
    });


    function placeRoadsAndShips() {
        //player colors: RED, ORANGE, BLUE, GREEN
        if (app.room && app.room.match) {
            var edgeInfo = app.room.match.map.edgeInfo;
            for (var edgeKey in edgeInfo) {
                var edge = edgeInfo[edgeKey];
                var edgeOne = edgeKey.split('-')[0];
                var edgeTwo = edgeKey.split('-')[1];


                var edgeOwner = edge.owner.color;
                var edgeType = edge.type;

                var selectVertexOne = ".vertice[data-id='" + edgeOne + "']";
                var selectVertexTwo = ".vertice[data-id='" + edgeTwo + "']";

                var xy1 = $(selectVertexOne).attr("style");
                var xy2 = $(selectVertexTwo).attr("style");
                xy1 = xy1.match(/\d+/g);
                xy2 = xy2.match(/\d+/g);


                var edgeElem = document.createElement("div");
                edgeElem.setAttribute("data-id", "" + edgeKey);

                edgeElem.style.left = (parseInt(xy1[1]) + parseInt(xy2[1])) / 2.0 - 22 + "px";
                edgeElem.style.top = (parseInt(xy1[0]) + parseInt(xy2[0])) / 2.0 + "px";
                // tilt down left to right
                var straight = ["8-9", "6-7", "19-20", "4-5", "17-18", "32-33", "2-3", "15-16", "30-31", "47-48", "13-14", "28-29", "45-46", "11-12", "26-27", "43-44", "61-62", "24-25", "41-42", "59-60", "22-23", "39-40", "57-58", "74-75", "37-38", "55-56", "72-73", "35-36", "53-54", "70-71", "85-86", "51-52", "68-69", "83-84", "49-50", "66-67", "81-82", "94-95", "64-65", "79-80", "92-93", "77-78", "90-91", "88-89"];
                var down = ["9-19", "7-17", "20-32", "5-15", "18-30", "33-47", "3-13", "16-28", "31-45", "48-63", "14-26", "29-43", "46-61", "12-24", "27-41", "44-59", "62-76", "10-22", "1-11", "25-39", "42-57", "60-74", "75-87", "58-72", "40-55", "23-37", "21-35", "38-53", "56-70", "73-85", "86-96", "71-83", "54-68", "36-51", "34-49", "52-66", "69-81", "84-94", "50-64", "67-79", "82-92", "78-88"];
                if (straight.indexOf(edgeKey) !== -1) {
                    edgeElem.setAttribute("class", "edge " + edgeOwner + " " + edgeType + " none");
                }
                else if (down.indexOf(edgeKey) !== -1) {
                    edgeElem.setAttribute("class", "edge " + edgeOwner + " " + edgeType + " down");
                } else {
                    edgeElem.setAttribute("class", "edge " + edgeOwner + " " + edgeType + " up");
                }

                placeIntoWebpage(edgeElem);


            }
        }
    }

    //place harbors into position
    function placeHarbors() {
        if (app.room && app.room.match) {
            var harborInfo = app.room.match.map.harbors;
            for (var edgeKey in harborInfo) {
                var edgeOne = edgeKey.split('-')[0];
                var edgeTwo = edgeKey.split('-')[1];
                var resourceType = harborInfo[edgeKey].type;

                var select = ".harbor[data-id='" + edgeKey + "']";

                if ($(select).length) {
                    return;
                }

                var selectVertexOne = ".vertice[data-id='" + edgeOne + "']";
                var selectVertexTwo = ".vertice[data-id='" + edgeTwo + "']";

                var xy1 = $(selectVertexOne).attr("style");
                var xy2 = $(selectVertexTwo).attr("style");
                xy1 = xy1.match(/\d+/g);
                xy2 = xy2.match(/\d+/g);


                // var select = ".vertice[data-id=''" + edgeKey + "]";
                var harborElem = document.createElement("div");
                harborElem.setAttribute("data-id", "" + edgeKey);
                harborElem.setAttribute("class", "harbor " + resourceType);

                harborElem.style.left = (parseInt(xy1[1]) + parseInt(xy2[1])) / 2.0 - 15 + "px";
                harborElem.style.top = (parseInt(xy1[0]) + parseInt(xy2[0])) / 2.0 - 15 + "px";

                placeIntoWebpage(harborElem);

            }
        }
    }


    function placeIntoWebpage(newNode) {
        $('#board .map').append(newNode);
    }


    // ----------------------------------------- Command Table ----------------------------------------- //

    $('#cmd-table').draggable();

    // display command table
    function showCmdTable() {
        $('#cmd-table').show();
        if (!$('#cmd-table .cmd.chosen').length) $('#cmd-table .cmd').first().click();
    }

    $(document).on('click', '#trigger-cmd-table', showCmdTable);

    // hide command table by clicking on 'X' or press 'ESC' key
    function hideCmdTable() {
        var $p = $('#cmd-table');
        clearHighlightedCommands();
        clearHighlightedVertices();
        $p.find('input').val('');
        $p.hide();
    }

    $('#cmd-table .pop_close').click(hideCmdTable);
    $(document).keyup(function (e) {
        if (e.keyCode == 27) hideCmdTable()
    });

    // check if cmd table is visible
    function isCmdTableVisible() {
        return $('#cmd-table').is(':visible');
    }

    // choose a command
    $('#cmd-table .cmd').click(function () {
        $('#cmd-table .cmd').removeClass('chosen');
        $(this).addClass('chosen');
        var cmd = $(this).attr('data-cmd');
        $('#cmd-table .op').hide();
        $('#cmd-table .op[data-cmd="' + cmd + '"]').show().find('input:first, select:first').eq(0).focus();
    });

    // return true if input is a number or a stringified number
    function isNum(n) {
        if (_.isNumber(n)) return true;
        if (String(parseInt(n)) == String(n)) return true;
        return false;
    }

    // Get command table inputs based on name attributes, return key-value pairs.
    // If value resembles to number, it's converted to number
    function getInput() {
        var data = {};
        $('#cmd-table .op:visible [name]').each(function () {
            var name = $(this).attr('name');
            var val = $(this).val();
            data[name] = isNum(val) ? parseFloat(val) : val;
        });
        return data;
    }


    // ----------------------------------------- Map actions ----------------------------------------- //

    // test if control key is pressed
    function isCtrlPressed(e) {
        return e.ctrlKey || e.metaKey;
    }

    // clear highlighted vertices
    function clearHighlightedVertices($except) {
        var $p = $('#cmd-table');
        var $map = $('#board .map');
        $map.find('.vertex').not($except).removeClass('ctrl-clicked')
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

    // highlight a vertex
    function highlightVertex($e) {
        $e.addClass('ctrl-clicked');
    }

    // check if element has class
    function isNot($e, cls) {
        return (!$e.hasClass(cls) && !$e.closest('.' + cls).length);
    }

    // un-highlight vertices when click elsewhere
    $('#board').click(function (e) {
        if (isNot($(e.target), 'vertex')) clearHighlightedVertices();
    });

    // click on vertex
    $('#board').on('click', '.vertex', function (e) {
        if (isCmdTableVisible()) return false;
        // if more than 2 select, clear
        if (highlightedVertices() > 2) clearHighlightedVertices();
        // when vertex is clicked while ctrl is pressed, select it
        if (isCtrlPressed(e)) highlightVertex($(this));
        // if ctrl-clicked vertices accumulate to 2 -> edge operation
        if (highlightedVertices() == 2) {
            showEdgeOperations();
        }
        // if click on single vertex -> vertex operation
        else if (!isCtrlPressed(e)) {
            highlightVertex($(this));
            showVertexOpeartions($(this));
        }
    });

    // click on 1 vertex
    function showVertexOpeartions($e) {
        var id = $e.attr('data-id');
        var $p = $('#cmd-table');
        var $ops = $p.find(`[vertex-needed="1"]`);
        var cmds = $ops.map(function () {
            return $(this).closest('.op').attr("data-cmd");
        });
        var $btns = $p.find('.cmds .cmd').filter(function () {
            return _.contains(cmds, $(this).attr('data-cmd'));
        });
        // highlight buttons for each matched opration
        $btns.addClass('matched');
        // fill vertex id for each matched operation
        $ops.find('input').val(id);
        // display first matched opeartion
        showCmdTable();
        $btns.first().click();
    }

    // click on 2 vertices
    function showEdgeOperations() {
        var $map = $('#board .map');
        var $cmd = $('#cmd-table');
        var $v1 = $map.find('.ctrl-clicked').eq(0);
        var $v2 = $map.find('.ctrl-clicked').eq(1);
        var id1 = $v1.attr('data-id');
        var id2 = $v2.attr('data-id');
        var $ops = $cmd.find(`[vertex-needed="2"]`);
        var cmds = $ops.map(function () {
            return $(this).closest('.op').attr("data-cmd");
        });
        var $btns = $cmd.find('.cmds .cmd').filter(function () {
            return _.contains(cmds, $(this).attr('data-cmd'));
        });
        // highlight buttons for each matched opration
        $btns.addClass('matched');
        // fill vertex id for each matched operation
        $ops.each(function () {
            $(this).find('input').eq(0).val(id1);
            $(this).find('input').eq(1).val(id2);
        });
        // display first matched opeartion
        showCmdTable();
        $btns.first().click();
    }


    //sock.emit('LOL');


});
