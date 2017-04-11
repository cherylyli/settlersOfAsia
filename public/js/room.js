
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
        },
        cityImprovement: {[Enum.cityImprovementCategory.Politics]: 0, [Enum.cityImprovementCategory.Trade]: 0, [Enum.cityImprovementCategory.Science]: 0}
    };

    // on page load, join room
    sock.emit('JOIN_ROOM', roomId);

    // room configuration is defined on url in stringified json format
    // we'll parse that and send it to server, then remove it from url
    // to make it look cleaner
    let mapConfig = JSON.parse(decodeURIComponent($.urlParam('config')));
    window.history.replaceState({}, null, window.location.pathname);

    // FIXME: change later, just for testing
    // if (mapConfig) mapConfig.savedGameID = "HmN7a";


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
        $('#waiting-page').css('transition', '2.5s ease');
        mapUI.initializeGame();
        /**
         swal({
            title: 'GAME START!',
            text: 'Are you prepared?',
            timer: 1000
        });
         app.log(null, 'The game starts.', true);**/
    });

    sock.on('GAME_ENDS', function (msg) {
         swalService.swal("Game Ended", "Winner: " + DATA.getMatch().winner);
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
            Metropolis: (room.match) ? room.match.Metropolis : {'Science': {owner: 'Nobody'}, 'Trade': {owner: 'Nobody'}, 'Politics': {owner: 'Nobody'}},
            ongoingCmd: null,   // some cmd may take more than one steps to finish
            ongoingCmdData: null,
            cmdThatEnablesOtherCmd: null,   // some cmd may enable user to use other cmd, like chaseAwayThief enables moveRobber/ movePirate
            cmdThatEnablesOtherCmdData: null,


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
                if (!window.app.room.match) return;
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
                Commands.saveGame();
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
            drawResourceCard: function () {
                generateDrawCardPrompt("drawOneResourceCard");
            },
            discardResourceCards: function () {
                showDiscardCardPrompt();
            },

            progressCardCommand: function (e) {
                let card = $(e.target).attr('data-id');
                // console.log($(e.target).attr('data').id, $(e.target).attr('data').cmd);
                showProgressCardCmd(card)
            },
            drawProgressCard: function () {
                generateDrawCardPrompt("drawOneProgressCard");
            },

            fishTokenCommand: function (e) {
                let tokenType = $(e.target).attr('data-id');
                // console.log($(e.target).attr('data').id, $(e.target).attr('data').cmd);
                showFishTokenInfo(tokenType);
            },

            buildRoad: function () {
                var {vertex1, vertex2} = getInput();
                Commands.buildRoad(vertex1, vertex2);
            },

            buildShip: function () {
                var {vertex1, vertex2} = getInput();
                Commands.buildShip(vertex1, vertex2);
            },

            buyCityImprovement: function (e) {
                let cityImprovementCategory = $(e.target).attr('data-type');
                let nextLevel = DATA.getMyPlayer().cityImprovement[cityImprovementCategory] + 1;
                let cost = Cost['cityImprove_' + cityImprovementCategory + '_' + nextLevel];
                let costSentence = "";

                for(let item in cost){
                    if (cost.hasOwnProperty(item)) costSentence += item + " × " + cost[item] + "  ";
                }

                swalService.swal({
                        title: "Improve to " + cityImprovementCategory + ": Level " + nextLevel ,
                        text: "Cost: " + costSentence,
                        type: "info",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Yes!",
                        cancelButtonText: "No",
                        closeOnConfirm: true,
                        closeOnCancel: true
                    },
                    function(isConfirm){
                        if (isConfirm) {
                            Commands.buyCityImprovement(cityImprovementCategory);
                        }
                    });

                // console.log(cityImprovementCategory);
                /**
                var {category} = getInput();
                var cityImprovementCategory = Enum.cityImprovementCategory[category];**/
                // Commands.buyCityImprovement(cityImprovementCategory);
            },

            buildCityWall: function () {
                var {vertex} = getInput();
                Commands.buildCityWall(vertex);
            },

            moveShip: function () {
                var {oldVertex1, oldVertex2, newVertex1, newVertex2} = getInput();
                Commands.moveShip(oldVertex1, oldVertex2, newVertex1, newVertex2);
            },

            trade: function (e) {
                let cmd = $(e.target).attr('data-cmd');

                generateTradePrompt(cmd);
                showCmdPrompt();
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
        if (window.app && window.app.room && DATA.getMatch()) mapUI.resizeMap();

        else {
            let $leftScreen = $('#left-screen');
            let len = $leftScreen.width() > $leftScreen.height() ? $leftScreen.width() : $leftScreen.height();
            //waiting pic
            $('#waiting-page').width(len);
            $('#waiting-page').height(len);
            $('#waiting-page img').width(len);
            $('#waiting-page img').height(len);
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







    // ----------------------------------------- Command Table ----------------------------------------- //

    // $('#cmd-table').draggable();

    // display command table
    // function showCmdTable() {
    //     $('#cmd-table').show();
    //     if (!$('#cmd-table .cmd.chosen').length) $('#cmd-table .cmd').first().click();
    // }



    // $(document).on('click', '#trigger-cmd-table', showCmdTable);

    // hide command table by clicking on 'X' or press 'ESC' key
    // function hideCmdTable() {
    //     var $p = $('#cmd-table');
    //     clearHighlightedCommands();
    //     clearHighlightedVertices();
    //     $p.find('input').val('');
    //     $p.hide();
    // }




    // $('#cmd-table .pop_close').click(hideCmdTable);
    // $(document).keyup(function (e) {
    //     if (e.keyCode == 27) hideCmdTable()
    // });

    // check if cmd table is visible
    // function isCmdTableVisible() {
    //     return $('#cmd-table').is(':visible');
    // }

    // function isCmdPromptVisible() {
    //     return $('#cmd-prompt').is(':visible');
    // }



    // for trade form cmd prompt, add and remove icon
    $('#cmd-prompt i.add').click(function (e) {
        addNewItem(e);
    });

    $('#cmd-prompt i.delete').click(function (e) {
        removeItem(e);
    });


    // choose a command
    // $('#cmd-table .cmd').click(function () {
    //     $('#cmd-table .cmd').removeClass('chosen');
    //     $(this).addClass('chosen');
    //     var cmd = $(this).attr('data-cmd');
    //     $('#cmd-table .op').hide();
    //     $('#cmd-table .op[data-cmd="' + cmd + '"]').show().find('input:first, select:first').eq(0).focus();
    // });


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


    // un-highlight vertices and hexes when click elsewhere
    $('#board').click(function (e) {
        if (isNot($(e.target), 'vertex')) clearHighlightedVertices();
        if (isNot($(e.target), 'hex')) clearHighlightedHexes();
    });


    // click on vertex
    $('body').on('click', '.vertex', function (e) {
        if (isCmdPromptVisible() || (app.ongoingCmd && !_.contains(vCommand, app.ongoingCmd))){
            return false;
        }
        // if (isCmdTableVisible()) return false;
        // if more than 2 select, clear
        if (highlightedVertices() > 2) clearHighlightedVertices();
        // when vertex is clicked while ctrl is pressed, select it
        if (isCtrlPressed(e)) highlightVertex($(this));
        // if ctrl-clicked vertices accumulate to 2 -> edge operation
        if (highlightedVertices() == 2) {
            if (!app.ongoingCmd) showEdgeOperations();
            else SpecialsCommandsFinalStep[app.ongoingCmd]();
        }
        // if click on single vertex -> vertex operation
        else if (!isCtrlPressed(e)) {
            highlightVertex($(this));
            if (!app.ongoingCmd || !SpecialsCommandsNextStep.hasOwnProperty(app.ongoingCmd)) showVertexOpeartions($(this));
            else if (SpecialsCommandsFinalStep.hasOwnProperty(app.ongoingCmd)) SpecialsCommandsFinalStep[app.ongoingCmd].apply(this, [$(this).attr('data-id')]);
        }
    });

    // click on hex
    $('body').on('click', '.hex', function (e) {
        if (isCmdPromptVisible()) return false;

        // FIXME: what if in the progress another cmd

        // if already selected a hex, clear
        if (highlightedHexes() >= 1) clearHighlightedHexes();

        highlightHexes($(this));
        console.log($(this).attr('data-id'));
        if (app.ongoingCmd == "moveThief") showHexOperations($(this));

    });





    $('body').on('click', '.metropolis', function (e) {
        showMetropolis(e);
    });


    // --------------------- user -----------------------
    $('#users').on('click', '.user', function (e) {
        if (isCmdPromptVisible()) return false;

        // FIXME: what if in the progress another cmd

        // if already selected a hex, clear
        if (highlightedHexes() >= 1) clearHighlightedHexes();
        if (highlightedVertices() >= 1) clearHighlightedVertices();

        let selectedPlayerName = $(this).attr('data-username');
        if (selectedPlayerName == (DATA.getMyPlayer().name)) return;
        // populateCmdPromptCmds(Player.getCommands(DATA.getMyPlayer()), [selectedPlayerName]);
        // TODO: for testing
        populateCmdPromptCmds(Player.getCommands(DATA.getMyPlayer()), [selectedPlayerName]);
        showCmdPrompt();
    });











    // ---------------------listen for special events
    sock.on('StolenBy', function (data) {
        let theif = data.theif;
        let card = data.card;


        swal({
            title: "Watch out for thief!",
            text: theif + " stole one " + card + " from you!",
            type: "warning",
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "What?!",
            closeOnConfirm: false,
        })

    });


    sock.on('KnightDisplaced', function (data) {
        console.log(data);
        let opponent = data.opponent;
        let knight = data.displacedKnight;
        if (knight.possibleSpots.length == 0){
            swal({
                title: "Knight Displaced!",
                text: opponent + " displaced your knight. There is no other valid site to replace the knight, the knight is moved off baord.",
                type: "warning",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "What?!",
                closeOnConfirm: true,
            });
            Commands.moveKnight(0, 0);
            return;
        }

        swal({
            title: "Knight Displaced!",
            text: opponent + " displaced your knight. Click on the map to move the knight!",
            type: "warning",
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Alright",
            closeOnConfirm: true,
        });

        app.ongoingCmd = "moveKnight";
        app.ongoingCmdData = [0];

    });


});

