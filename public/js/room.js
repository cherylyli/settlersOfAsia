
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

            // cmd prompt
            addItem: function (e) {
                let $buttonClicked = $(e.target).parent();
                let $newButton = $buttonClicked.clone();
                // let $button =  $("#cmd-prompt .button[data-id=select]").eq(0).clone();
                $buttonClicked.after($newButton);
                // $("#cmd-prompt .button[data-id=add]").before($button);
               // (($("#cmd-prompt .button[data-id=select]"))[0]).clone().before($("#cmd-prompt .button[data-id=add]"));
            },

            deleteItem: function () {

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
                showDrawCardPrompt("drawOneResourceCard");
            },

            progressCardCommand: function (e) {
                let card = $(e.target).attr('data-id');
                // console.log($(e.target).attr('data').id, $(e.target).attr('data').cmd);
                showProgressCardCmd(card);
            },
            drawProgressCard: function () {
                showDrawCardPrompt("drawOneProgressCard");
            },

            fishTokenCommand: function (e) {
                let tokenType = $(e.target).attr('data-id');
                // console.log($(e.target).attr('data').id, $(e.target).attr('data').cmd);
                showFishTokenInfo(tokenType);
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

            buyCityImprovement: function (e) {
                let cityImprovementCategory = $(e.target).attr('data-type');
                let nextLevel = DATA.getMyPlayer().cityImprovement[cityImprovementCategory] + 1;
                let cost = Cost['cityImprove_' + cityImprovementCategory + '_' + nextLevel];
                let costSentence = "";

                for(let item in cost){
                    if (cost.hasOwnProperty(item)) costSentence += item + " × " + cost[item] + "  ";
                }

                swal({
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

                // for different cmd, when we click confirm, we run different cmd.


                showCmdPrompt();

                //if (cmd == "tradeWithBank"){
                //}
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



    // for trade form cmd prompt, add and remove icon
    $('#cmd-prompt i.add').click(function (e) {
        addNewItem(e);
    });

    $('#cmd-prompt i.delete').click(function (e) {
        removeItem(e);
    });

    // FIXME: Is there a nicer way to create listner on dynamically generated divs???
    function addNewItem(e) {
        let $buttonClicked = $(e.target).parent();
        let $newButton = $buttonClicked.clone();
        let $form = $buttonClicked.parent();
        // change name of input
        let buttonNumber = $form.find('.button').size();  // title is also a button, so number of buttons is size() - 1, no for this button is size() - 1 +1
        let type = $form.attr('data-id');
        $newButton.find('input').attr('name', type + buttonNumber + 'cnt');
        $newButton.find('select').attr('name', type + buttonNumber);

        // create listener for new button
        $newButton.find('i.add').click(function (e) {
            addNewItem(e);
        });
        $newButton.find('i.delete').click(function (e) {
            removeItem(e);
        });
        // let $button =  $("#cmd-prompt .button[data-id=select]").eq(0).clone();
        $buttonClicked.after($newButton);
    }


    function removeItem(e) {
        let $button = $(e.target).parent();
        let $form = $button.parent();
        if ($form.find('.button').size() <= 2){
            swalError2("You should at least have one item!");
            return;
        }
        $button.remove();

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

    function getInputCmdPrompt() {
        var data = {};
        $('#cmd-prompt [name]').each(function () {
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

    //$(document).on('click', '.vertex', function(e){ console.log('lol') })

    // click on vertex
    $('body').on('click', '.vertex', function (e) {
        if (isCmdPromptVisible()){
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
            if (!app.ongoingCmd) showVertexOpeartions($(this));
            else SpecialsCommandsFinalStep[app.ongoingCmd].apply(this, [$(this).attr('data-id')]);
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
        if (!app.ongoingCmd) showHexOperations($(this));

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
     * @param type {String} "selling" / "buying"
     */
    function generateTradeForm(type, cmd) {
        let $form = $('<div></div>');
        $form.attr('data-id', type);

        let $title = $('<div>' + type + '</div>');
        $title.addClass('button title ' + type);
        $form.append($title);

        let $item = $('<div class="button ' + type + '" data-id="select"> </div>');
        let $select = $('<select class="weui-select"></select>');
        $select.attr('name', type + 1);
        $item.append($select);

        _.forEach(Enum.Tradable, function (item) {
            let $option = $('<option value="' + item + '">' + item + '</option>');
            $select.append($option);
        });




        if (cmd != "tradeWithBank"){
            // trade with player
            let $input = $('<input class="weui-input" type="number" pattern="[0-9]*" placeholder="0">');
            $input.attr('name', type + 1 + "cnt");
            $item.append($input);

            // add and delete icon
            $item.append('<i class="fa fa-minus-circle delete" aria-hidden="true"></i> <i class="fa fa-plus-circle add" aria-hidden="true"></i>');
        }

        else if (type == "buying"){
            // default
            let ratio = DATA.getMyPlayer().tradeRatio["Lumber"];
            // trade with bank
            let $ratioInfo = $('<div class="trade-info"><i class="fa fa-info-circle" aria-hidden="true">  trade ratio</i><div class="text">'+ ratio +'</div><div></div>');

            $select.change(function () {
                let type = $select.val();
                $ratioInfo.find('.text').text(DATA.getMyPlayer().tradeRatio[type]);
                console.log(DATA.getMyPlayer().tradeRatio[type]);
                console.log($select.val());
            });
        
            $item.append($ratioInfo);
        }

        $form.append($item);

        return $form;
    }

    /**
     *
     * @param cmd
     * @param options {String[]}
     */
    function generateOptionPrompt(cmd, options) {
        let $prompt = $('#cmd-prompt');

        $prompt.append( '<div class="button" data-id="confirm">' + cmd + '</div> <div class="button" data-id="cancel">Cancel</div>');

        // cancel button
        $prompt.find('.button[data-id=cancel]').click(function () {
            hideCmdPrompt();
        });


        // confirm button
        $prompt.find('.button[data-id=confirm]').click(function () {
            let input = getInputCmdPrompt();
            let {selling, buying} = readTradeInput(input);


            if (cmd == "tradeWithBank"){

                console.log("selling", selling);
                console.log("buying", buying);

                // command trade with bank
                // TODO: Yuan / Emol change trade with bank cmd (it should accept cost object)
            }

            else {

            }

            hideCmdPrompt();

        });
    }


    /**
     *
     * @param cmd {String} command name
     */
    function generateTradePrompt(cmd) {
        if (isCmdPromptVisible()) hideCmdPrompt();
        let $prompt = $('#cmd-prompt');
        $prompt.append(generateTradeForm('buying', cmd));
        $prompt.append(generateTradeForm('selling', cmd));

        $prompt.append( '<div class="button" data-id="confirm">Trade</div> <div class="button" data-id="cancel">Cancel</div>');

        // add listener
        // for trade form cmd prompt, add and remove icon
        $('#cmd-prompt i.add').click(function (e) {
            addNewItem(e);
        });

        $('#cmd-prompt i.delete').click(function (e) {
            removeItem(e);
        });

        // cancel button
        $prompt.find('.button[data-id=cancel]').click(function () {
            hideCmdPrompt();
        });

        // confirm button
        $prompt.find('.button[data-id=confirm]').click(function () {
            let input = getInputCmdPrompt();
            let {selling, buying} = readTradeInput(input, cmd);


            if (cmd == "tradeWithBank"){

                console.log("selling", selling);
                console.log("buying", buying);
                Commands.tradeWithBank(selling, buying);

                // command trade with bank
                // TODO: Yuan / Emol change trade with bank cmd (it should accept cost object)
            }

            else {
                console.log("Trade is working!");
                Commands.requestTrade(selling, buying);
            }

            hideCmdPrompt();


        });

        //getInputCmdPrompt
    }

    /**
     *
     * @param input
     * @return {Cost, Cost} selling and buying
     */
    function readTradeInput(input, cmd){
        let sellingType = {};   // temp storage
        let buyingType = {};

        let selling = {};
        let buying = {};

        // read type
        for (let key in input){
            if (input.hasOwnProperty(key) && !key.includes("cnt")){
                let type = input[key];
                let number;
                if (key.includes("buying")){
                    number = key.substr(6);
                    buyingType[number] = type;
                }
                if (key.includes("selling")){
                    number = key.substr(7);
                    sellingType[number] = type;
                }
            }
        }

        if (cmd == "tradeWithBank"){
            selling = _.values(sellingType)[0];
            buying = _.values(buyingType)[0];
            return {selling, buying};
        }

        // read cnt
        for (let key in input){
            if (input.hasOwnProperty(key) && key.includes("cnt") && input[key] != "" ){
                let number;
                if (key.includes("buying")){
                    number = key.substr(6, 1);
                    buying[buyingType[number]] = input[key];   // o is dummy value
                }
                if (key.includes("selling")){
                    number = key.substr(7, 1);
                    selling[sellingType[number]] = input[key];
                }
            }
        }

        return {selling, buying};


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




    /**
     * @param opts String[] a list of options used to generate prompt options
     * @param cmds String[] a list of cmds used to generate prompt options
     * @param data the data user inputted (command argument)
     */
    function populateCmdPromptOptions(opts, cmds, data = []) {
        let $prompt = $('#cmd-prompt');
        //$prompt.find('.button').not('.button[data-id=cancel]').remove();
        $prompt.prepend($('<div class="button" data-id="cancel">Cancel</div>'));
        for (let i = 0; i < opts.length; i++){
            let cmd = cmds[i];
            let opt = opts[i];
            let $cmd = $('<div class="button">' + opt + '</div>');
            $cmd.attr({
                'cmd': cmd,
                'opt': opt
            });
            $prompt.prepend($cmd);
        }

        // add listener here because we generate the buttons dynamically
        $('#cmd-prompt .button').click(function (e) {
            let $button = $(e.target);

            if ($button.attr('data-id') == 'cancel') {
                hideCmdPrompt();
            }
            else {
                let cmdName = $button.attr('cmd');
                let opt = $button.attr('opt');
                hideCmdPrompt();
                data.push(opt);
                console.log(data);

                if (_.has(SpecialsCommands, cmdName)){
                    SpecialsCommandsNextStep[cmdName].apply(this, data);
                }
                else {
                    Commands[cmdName].apply(this, data);
                }
                // console.log($button.attr('cmd'));**/
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
                cancelButtonText: "Cancel",
                closeOnConfirm: true,
                closeOnCancel: true
            },
            function(isConfirm){
                if (isConfirm) {
                    app.ongoingCmd = "moveKnight";
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
                cancelButtonText: "Cancel",
                closeOnConfirm: true,
                closeOnCancel: true
            },
            function(isConfirm){
                if (isConfirm) {
                    let oldPosition = app.ongoingCmdData[0];
                    Commands.moveKnight(oldPosition, newPosition);
                }

                app.ongoingCmd = null;
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
    };



    SpecialsCommandsNextStep.moveShip = function (oldV1, oldV2) {
        swal({
                title: "Move Ship",
                text: "Where do you want to move the ship to? (Click two points with CTRL pressed)",
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "OK!",
                cancelButtonText: "Cancel",
                closeOnConfirm: true,
                closeOnCancel: true
            },
            function(isConfirm){
                if (isConfirm) {
                    app.ongoingCmd = "moveShip";
                    app.ongoingCmdData = [oldV1, oldV2];
                }
            });
    };


    SpecialsCommandsFinalStep.moveShip = function () {
        var $map = $('#board .map');
        var $cmd = $('#cmd-table');
        var $v1 = $map.find('.ctrl-clicked').eq(0);
        var $v2 = $map.find('.ctrl-clicked').eq(1);
        let newPosition = Map.edge($v1.attr('data-id'), $v2.attr('data-id'));

        swal({
                title: "Move Ship here?",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes!",
                cancelButtonText: "Cancel",
                closeOnConfirm: true,
                closeOnCancel: true
            },
            function(isConfirm){
                if (isConfirm) {
                    let oldVertex1 = app.ongoingCmdData[0];
                    let oldVertex2 = app.ongoingCmdData[1];
                    Commands.moveShip(oldVertex1, oldVertex2, newPosition[0], newPosition[1]);
                }

                app.ongoingCmd = null;
                app.ongoingCmdData = null;
                clearHighlightedVertices();
            });
    };




    // -----------------------right side command buttons ------------------------

    function showProgressCardCmd(card){
        hideCmdPrompt();
        populateCmdPromptCmds(ProgressCardCommand, [card]);
        showCmdPrompt();

    }

    function showDrawCardPrompt(cmd) {
        // FIXME: maybe text whether player have selected other stuffs here?
        let opts;
        if (cmd == "drawOneResourceCard"){
            opts = Object.values(Enum.Resource);
        }
        if (cmd == "drawOneProgressCard"){
            opts = Object.values(Enum.cityImprovementCategory);
        }
        let cmds = new Array(opts.length).fill(cmd);

        populateCmdPromptOptions(opts, cmds);
        showCmdPrompt();
    }

    function showFishTokenInfo(tokenType) {
        //hideCmdPrompt();
        console.log(tokenType);
        if (tokenType == Enum.fishToken.BOOT){
             swal({
                    title: "Boot Token",
                    text: "Click other player to give away the boot!",
                    type: "info",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Cool!",
                    closeOnConfirm: true,
                });
            //populateCmdPromptCmds(FishTokenCommand.Boot, [tokenType]);
        }
        else {
            hideCmdPrompt();
            let opts = Object.values(Enum.fishEvent);
            let cmds = new Array(opts.length).fill("spendFishToken");
            populateCmdPromptOptions(opts, cmds);
            showCmdPrompt();
            /**
            swal({
                    html: true,
                    title: "Fish Token",
                    text: "Hey, you can use fish tokens to do a lot of things!<br>2 fish - move robber off board (click robber)<br>3 fish - steal resource card (click the player you want to steal from)<br>4 fish - take a resource from bank (click bank icon)<br>5 fish - build road<br>7 fish - draw development card!",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Cool!",
                    closeOnConfirm: true,
                })*/
        }
    }




    // --------------------- user -----------------------
    $('#users').on('click', '.user', function (e) {
        if (isCmdPromptVisible()) return false;

        // FIXME: what if in the progress another cmd

        // if already selected a hex, clear
        if (highlightedHexes() >= 1) clearHighlightedHexes();
        if (highlightedVertices() >= 1) clearHighlightedVertices();

        let selectedPlayerName = $(this).attr('data-username');
        // populateCmdPromptCmds(Player.getCommands(DATA.getMyPlayer()), [selectedPlayerName]);
        // TODO: for testing
        populateCmdPromptCmds(Object.values(PlayerCommand), [selectedPlayerName]);
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


});
