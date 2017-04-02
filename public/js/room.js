
// set up environment
$(document).ready(function(){
    var evt = $.Event('imready');

    // Fetch my data from server
    $get('/mydata', function(data){

        // if not logged in, redirect to login
        if (!data) return window.location.href = '/login';
        evt.myObj = data;

        // show page
        $(window).trigger(evt);
    });
});


// upon environment set up
$(window).on('imready', function(im){

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
        }, 2000);
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
                "buildSettlement", "upgradeToCity", "buildRoad", "buildShip", "buildCityWall", "moveShip", "tradeWithBank", "moveRobber", "movePirate","executeProgressCard", "requestTrade"
            ],
            isMyTurn: false,
            barbarianResult: false,
            specialCmdTriggered: null,
            ongoingCmdData: null

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
                mapUI.updateMap();
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

            moveRobber: function () {
                var {newHexID} = getInput();
                Commands.moveRobber(newHexID);
            },

            movePirate: function () {
                var {newHexID} = getInput();
                Commands.movePirate(newHexID);
            },

            executeProgressCard: function(){
                var {card} = getInput();
                console.log(card);
                Commands.executeProgressCard(card);
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
            },

            requestTrade : function(){
                var result = getInput();
                console.log(result);
                let selling = {};
                for (let card in result){
                    if (card.charAt(card.length - 1) == 'S'){
                        if (result[card] == "" || result[card] ==" ") continue;
                        selling[card.substr(0, card.length - 1)] = result[card];
                    }
                }
                let buying = {};
                for (let card in result){
                    if (card.charAt(card.length - 1) == 'B'){
                        if (result[card] == "" || result[card] ==" ") continue;
                        buying[card.substr(0, card.length - 1)] = result[card];
                    }
                }

                console.log(selling, buying);
                Commands.requestTrade(selling, buying);
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

    // display command prompt
    function showCmdPrompt() {
        $('#cmd-prompt').show();
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


    function hideCmdPrompt() {
        clearHighlightedVertices();
        clearHighlightedHexes();
        let $prompt = $('#cmd-prompt');
        $prompt.find('.button').remove();
        $prompt.hide();
    }

    $('#cmd-table .pop_close').click(hideCmdTable);
    $(document).keyup(function (e) {
        if (e.keyCode == 27) hideCmdTable()
    });

    // check if cmd table is visible
    function isCmdTableVisible() {
        return $('#cmd-table').is(':visible');
    }

    function isCmdPromptVisible() {
        return $('#cmd-prompt').is(':visible');
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

    // un-highlight vertices and hexes when click elsewhere
    $('#board').click(function (e) {
        if (isNot($(e.target), 'vertex')) clearHighlightedVertices();
        if (isNot($(e.target), 'hex')) clearHighlightedHexes();
    });

    // click on vertex
    $('#board').on('click', '.vertex', function (e) {
        if (isCmdPromptVisible()) return false;
        // if (isCmdTableVisible()) return false;
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
            if (!app.specialCmdTriggered) showVertexOpeartions($(this));
            else SpecialsCommandsFinalStep[app.specialCmdTriggered].apply(this, [$(this).attr('data-id')]);
        }
    });

    // click on hex
    $('#board').on('click', '.hex', function (e) {
        // if already selected a hex, clear
        if (highlightedHexes() >= 1) clearHighlightedHexes();

        highlightHexes($(this));
        console.log($(this).attr('data-id'));
        showHexOperations($(this));
    });

    // click on 1 vertex
    function showVertexOpeartions($e) {
        let vertexID = parseInt($e.attr('data-id'));
        populateCmdPromptCmds(VertexUnit.getCommands(vertexID), [vertexID]);
        showCmdPrompt();

        /**
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
        $btns.first().click();**/
    }

    // click on 2 vertices
    function showEdgeOperations() {
        var $map = $('#board .map');
        var $cmd = $('#cmd-table');
        var $v1 = $map.find('.ctrl-clicked').eq(0);
        var $v2 = $map.find('.ctrl-clicked').eq(1);
        let edge = Map.edge($v1.attr('data-id'), $v2.attr('data-id'));
        populateCmdPromptCmds(EdgeUnit.getCommands(edge), [edge[0], edge[1]]);
        showCmdPrompt();
        /**
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
        $btns.first().click();**/
    }

    function showHexOperations($e){
        let hexID = parseInt($e.attr('data-id'));
        populateCmdPromptCmds(HexTile.getCommands(hexID), [hexID]);
        showCmdPrompt();
    }

    /**
     *
     * @param cmds String[] a list of cmds used to generate prompt options
     * @param data the data user inputted (command argument)
     */
    function populateCmdPromptCmds(cmds, data) {
        let $prompt = $('#cmd-prompt');
        //$prompt.find('.button').not('.button[data-id=cancel]').remove();
        $prompt.prepend($('<div class="button" data-id="cancel">Cancel</div>'));
        _.forEach(cmds, function (cmd) {
            let $cmd = $('<div class="button">' + cmd + '</div>');
            $cmd.attr('cmd', cmd);
            $prompt.prepend($cmd);
        });


        // add listener here because we generate the buttons dynamically
        $('#cmd-prompt .button').click(function (e) {
            let $button = $(e.target);

            if ($button.attr('data-id') == 'cancel') {
                hideCmdPrompt();
            }
            else {
                let cmdName = $button.attr('cmd');
                hideCmdPrompt();
                if (_.has(SpecialsCommands, cmdName)){
                    SpecialsCommandsNextStep[cmdName].apply(this, data);
                }
                else {
                    Commands[cmdName].apply(this, data);
                }
                // console.log($button.attr('cmd'));
            }

        });
    }




    // -----------------special cmd prompt for cmd requires multi-steps-----------------------
    /**
     *
     * @param position {int} old position
     */
    SpecialsCommandsNextStep.moveKnight = function (position) {
        swal({
                title: "Move Knight",
                text: "Click on the map where you want to move the knight!",
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "OK!",
                cancelButtonText: "No, I don't want to move the knight now!",
                closeOnConfirm: true,
                closeOnCancel: true
            },
            function(isConfirm){
                if (isConfirm) {
                    app.specialCmdTriggered = "moveKnight";
                    app.ongoingCmdData = [position];
                }
            });
    };

    SpecialsCommandsFinalStep.moveKnight = function (newPosition) {
        swal({
                title: "Move knight here?",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes!",
                cancelButtonText: "No, I don't want to move the knight now!",
                closeOnConfirm: true,
                closeOnCancel: true
            },
            function(isConfirm){
                if (isConfirm) {
                    let oldPosition = app.ongoingCmdData[0];
                    Commands.moveKnight(oldPosition, newPosition);
                }

                app.specialCmdTriggered = null;
                app.ongoingCmdData = null;
                clearHighlightedVertices();
            });
    };


    SpecialsCommandsNextStep.upgradeToMetropolis = function(position){
        let $prompt = $('#cmd-prompt');

        $prompt.prepend($('<div class="button" data-id="cancel">Cancel</div>'));

        _.forEach(Enum.cityImprovementCategory, function (type) {
            let $opt = $('<div class="button">' + type + '</div>');
            $opt.attr('type', type);
            $prompt.prepend($opt);
        });


        // add listener here because we generate the buttons dynamically
        $('#cmd-prompt .button').click(function (e) {
            let $button = $(e.target);

            if ($button.attr('data-id') == 'cancel') {
            }

            else {
                let type = $button.attr('type');
                Commands.upgradeToMetropolis.apply(this, [position, type]);
                // console.log($button.attr('cmd'));
            }
            hideCmdPrompt();

        });

        showCmdPrompt();
    }





});
