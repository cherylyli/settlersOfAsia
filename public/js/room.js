
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
    //console.log(window.myObj);
    let roomId = window.location.pathname.split("/").pop();

    // parse a fake room data just for test
    //var room = window.room = {users: []};


    // template for user
    var fakeUser = window.fakeUser = {
        resourcesAndCommodities: {"Lumber":0,"Brick":0,"Grain":0,"Ore":0,"Wool":0,"Gold":2,"Cloth":0,"Coin":0,"Paper":0}
    };

    // on page load, join room
    sock.emit('JOIN_ROOM', roomId);

    //test data
    //for now, assume player choose this map
    let mapConfig = {'scenario':'Heading For New Shores'};
    sock.emit('MAP_CONFIG', mapConfig);

    // when sock disconnects and reconnects, join room again
    sock.on('reconnect', function(){
        sock.emit('JOIN_ROOM', roomId);
    });

    // upon successfully joined room, server will send back a message
    sock.on('JOIN_ROOM_SUCCESS', function(msg){
        app.setMy();
    });


    sock.on('NEW_PLAYER_JOINED', function (msg) {
    });


    sock.on('NEW_ROOM_OWNER', function (msg) {
        alert("Now you are the owner of this room!");
        //TODO: maybe gives the room owner some priviledge like setting the map etc
    });

    sock.on('A_PLAYER_LEFT_ROOM', function (msg) {
    });

    sock.on('GAME_START', function (msg) {
        alert('Game start');
        //entry point for max's code

    });

    sock.on('TAKE_TURN', function (msg) {
        alert('Take turn');
        app.isMyTurn = true;
    });







    // ----------------------------- View Layer ----------------------------- //

    var app = window.app = new Vue({
        el: '#page',
        data: {
            me: myObj,
            my: fakeUser,
            room: room,
            Enum: Enum,
            logs: [
                { user: null, action: 'The game starts.', system: true },
                { user: 'Yuan', action: 'places a city.', system: true },
                { user: 'jack', action: 'places a road.', system: true },
                { user: 'Max', action: "stop cheating man", system: false },
                { user: 'Emol', action: "i aint cheating -_-", system: false }
            ],
            cmds: [
                "buildEstablishment", "buildRoad", "buildShip", "buildCityWall",
                "buyCityImprovement", "moveShip", "tradeWithBank"
            ],
            isMyTurn: false
        },
        mounted: function(){
            $('body').showV();
            adjustUI();
            console.log('view mounted');
        },
        updated: function(){
            console.log('view updated');
            adjustUI();
        },
        filters: {
            capitalize: beautify.capitalize,
            startCase: function(text){
                var result = text.replace( /([A-Z])/g, " $1" );
                var capped = result.charAt(0).toUpperCase() + result.slice(1);
                return capped;
            }
        },
        methods: {
            call: function(fn){
                this[fn]();
            },

            // make 'my' point to my object inside users
            setMy: function(){
                var my = this.room.users[myObj.username];
                if (my) this.my = my;
            },

            // save match
            save: function(){
                Toast.show('Saved!');
            },

            // continue previously saved match
            open: function(){
                Toast.show('Open');
            },

            // quit match
            quit: function(){
                Toast.show('Match ended!');
            },

            // append to log
            log: function(user, action, system){
                this.logs.push({ user, action, system });
                NextTick(function(){
                    $('#log .msgs').scrollTop($('#log .msgs')[0].scrollHeight);
                });
            },

            // chat in room
            sendMessage: function(){
                var content = $('#log input').val();
                sock.emit('send-message', content);
                $('#log input').val('');
            },

            endTurn: function () {
                if(CommandCheck.endTurn(CommandsData.endTurn())) Commands.endTurn();
            },

            // roll dice
            rollDice: function(){
                if(CommandCheck.rollDice(CommandsData.rollDice())) Commands.rollDice();
            },

            buildEstablishment: function () {
                var {vertex, establishmentLV } = getInput();

                if (establishmentLV == 1){
                    if (CommandCheck.buildSettlement(CommandsData.buildEstablishment(vertex, establishmentLV))) Commands.buildEstablishment(vertex, establishmentLV);
                }
                if (establishmentLV == 2){
                    if (CommandCheck.buildSettlement(CommandsData.buildEstablishment(vertex, establishmentLV))) Commands.buildEstablishment(vertex, establishmentLV);
                };
            },

            buildRoad: function () {
                var {vertex1, vertex2} = getInput();
                if (CommandCheck.buildRoad(CommandsData.buildRoad(vertex1, vertex2)))Commands.buildRoad(vertex1, vertex2);
            },

            buildShip: function () {
                var {vertex1, vertex2} = getInput();
                if (CommandCheck.buildShip(CommandsData.buildShip(vertex1, vertex2))) Commands.buildShip(vertex1, vertex2);
            },

            buyCityImprovement: function () {
                var {category} = getInput();
                var cityImprovementCategory =  Enum.cityImprovementCategory[category];
                if (CommandCheck.buyCityImprovement(CommandsData.buyCityImprovement(cityImprovementCategory))) Commands.buyCityImprovement(cityImprovementCategory);
            },

            buildCityWall: function () {
                var {vertex} = getInput();
                if (CommandCheck.buildCityWall(CommandsData.buildCityWall(vertex))) Commands.buildCityWall(vertex);
            },

            moveShip: function(){
                var {oldVertex1, oldVertex2, newVertex1, newVertex2} = getInput();
                if (CommandCheck.moveShip(CommandsData.moveShip(oldVertex1, oldVertex2, newVertex1, newVertex2))) Commands.moveShip(oldVertex1, oldVertex2, newVertex1, newVertex2);
            },

            tradeWithBank: function(){
                var {src, tradeFor} = getInput();
                if (CommandCheck.tradeWithBank(CommandsData.tradeWithBank(src, tradeFor))) Commands.tradeWithBank(src, tradeFor);
            }

        }
    });

    // adjust UI when resize screen
    function adjustUI(){
        // adjust system log height
        $('#log').outerHeight($('#right-screen').height() - $('#users').outerHeight() - $('#match-opts').outerHeight());
    }
    $(window).resize(adjustUI);

    // receive message
    sock.on('receive-message', function(msg){
        app.log(msg.username, msg.content, false);
    });






    // ----------------------------------------- Command Table ----------------------------------------- //

    $('#cmd-table').draggable();

    // display command table
    function showCmdTable(){
        $('#cmd-table').show();
        if (!$('#cmd-table .cmd.chosen').length) $('#cmd-table .cmd').first().click();
    }
    $(document).on('click', '#trigger-cmd-table', showCmdTable);

    // hide command table by clicking on 'X' or press 'ESC' key
    function hideCmdTable(){
        var $p = $('#cmd-table');
        clearHighlightedCommands();
        clearHighlightedVertices();
        $p.find('input').val('');
        $p.hide();
    }
    $('#cmd-table .pop_close').click(hideCmdTable);
    $(document).keyup(function(e) { if (e.keyCode == 27) hideCmdTable() });

    // check if cmd table is visible
    function isCmdTableVisible(){
        return $('#cmd-table').is(':visible');
    }

    // choose a command
    $('#cmd-table .cmd').click(function(){
        $('#cmd-table .cmd').removeClass('chosen');
        $(this).addClass('chosen');
        var cmd = $(this).attr('data-cmd');
        $('#cmd-table .op').hide();
        $('#cmd-table .op[data-cmd="' + cmd + '"]').show().find('input:first, select:first').eq(0).focus();
    });

    // return true if input is a number or a stringified number
    function isNum(n){
        if (_.isNumber(n)) return true;
        if (String(parseInt(n)) == String(n)) return true;
        return false;
    }

    // Get command table inputs based on name attributes, return key-value pairs.
    // If value resembles to number, it's converted to number
    function getInput(){
        var data = {};
        $('#cmd-table .op:visible [name]').each(function(){
            var name = $(this).attr('name');
            var val = $(this).val();
            data[name] = isNum(val) ? parseFloat(val) : val;
        });
        return data;
    }






    // ----------------------------------------- Map actions ----------------------------------------- //

    // test if control key is pressed
    function isCtrlPressed(e){
        return e.ctrlKey || e.metaKey;
    }

    // clear highlighted vertices
    function clearHighlightedVertices($except){
        var $p = $('#cmd-table');
        var $map = $('#board .map');
        $map.find('.vertice').not($except).removeClass('ctrl-clicked')
    }

    // clear highlighted commands
    function clearHighlightedCommands(){
        var $p = $('#cmd-table');
        var $map = $('#board .map');
        $p.find('.cmds .cmd').removeClass('matched'); // remove highlighted commands
    }

    // count number of highlighted vertices
    function highlightedVertices(){
        return $('#board .map .vertice.ctrl-clicked').length;
    }

    // highlight a vertex
    function highlightVertex($e){
        $e.addClass('ctrl-clicked');
    }

    // check if element has class
    function isNot($e, cls){
        return (!$e.hasClass(cls) && !$e.closest('.'+cls).length);
    }

    // un-highlight vertices when click elsewhere
    $('#board').click(function(e){
        if (isNot($(e.target), 'vertice')) clearHighlightedVertices();
    });

    // click on vertex
    $('#board').on('click', '.vertice', function(e){
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
        else if (!isCtrlPressed(e)){
            highlightVertex($(this));
            showVertexOpeartions($(this));
        }
    });

    // click on 1 vertex
    function showVertexOpeartions($e){
        var id = $e.attr('data-id');
        var $p = $('#cmd-table');
        var $ops = $p.find(`[vertex-needed="1"]`);
        var cmds = $ops.map(function(){
            return $(this).closest('.op').attr("data-cmd");
        });
        var $btns = $p.find('.cmds .cmd').filter(function(){
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
    function showEdgeOperations(){
        var $map = $('#board .map');
        var $cmd = $('#cmd-table');
        var $v1 = $map.find('.ctrl-clicked').eq(0);
        var $v2 = $map.find('.ctrl-clicked').eq(1);
        var id1 = $v1.attr('data-id');
        var id2 = $v2.attr('data-id');
        var $ops = $cmd.find(`[vertex-needed="2"]`);
        var cmds = $ops.map(function(){
            return $(this).closest('.op').attr("data-cmd");
        });
        var $btns = $cmd.find('.cmds .cmd').filter(function(){
            return _.contains(cmds, $(this).attr('data-cmd'));
        });
        // highlight buttons for each matched opration
        $btns.addClass('matched');
        // fill vertex id for each matched operation
        $ops.each(function(){
            $(this).find('input').eq(0).val(id1);
            $(this).find('input').eq(1).val(id2);
        });
        // display first matched opeartion
        showCmdTable();
        $btns.first().click();
    }












    //game stuff, maybe move to another js file later
    //here are just tests, call the functions when the certain button is pressed.
    //sock.emit('rollDice', roomId);









    //sock.emit('LOL');



});