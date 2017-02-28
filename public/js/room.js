
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
       //alert('NEW_PLAYER_JOINED');
       //change ui
    });

    sock.on('GAME_START', function (msg) {
        alert('Game start');
        //entry point for max's code

    });

    sock.on('TAKE_TURN', function (msg) {
        alert('Take turn');
        $("button").removeAttr('disabled');
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
            ]
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
                Commands.endTurn();
            },

            // roll dice
            rollDice: function(){
                Commands.rollDice();
            },

            buildEstablishment: function () {
                var {vertex, establishmentLV } = getInput();
                Commands.buildEstablishment(vertex, establishmentLV);
            },

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
                var cityImprovementCategory =  Enum.cityImprovementCategory[category];
                Commands.buyCityImprovement(cityImprovementCategory);
            },

            buildCityWall: function () {
                var {vertex} = getInput();
                Commands.buildCityWall(vertex);
            },

            moveShip: function(){
                var {oldVertex1, oldVertex2, newVertex1, newVertex2} = getInput();
                Commands.moveShip(oldVertex1, oldVertex2, newVertex1, newVertex2);
            },

            tradeWithBank: function(){
                var {src, tradeFor} = getInput();
                Commands.tradeWithBank(src, tradeFor);
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

    // display symbol table
    $(document).on('click', '#trigger-cmd-table', function(){
        $('#cmd-table').show();
        if (!$('#cmd-table .cmd.chosen').length) $('#cmd-table .cmd').first().click();
    });

    // hide symbol table by clicking on 'X' or press 'ESC' key
    function hideCmdTable(){
        $('#cmd-table').hide();
    }
    $('#cmd-table .pop_close').click(hideCmdTable);
    $(document).keyup(function(e) { if (e.keyCode == 27) hideCmdTable() });

    // choose a command
    $('#cmd-table .cmd').click(function(){
        $('#cmd-table .cmd').removeClass('chosen');
        $(this).addClass('chosen');
        var cmd = $(this).attr('data-cmd');
        $('#cmd-table .op').hide();
        $('#cmd-table .op[data-cmd="' + cmd + '"]').show();
    });

    // use up/down arrows to choose command
    $(document).keydown(function(e){
        if (!$('#cmd-table .cmd').is(':visible')) return;
        if (e.which == 38){ // up
            var $e = $('#cmd-table .cmd.chosen:visible').first().prev();
            if ($e.length) $e.click();
        }
        else if (e.which == 40){ // down
            var $e = $('#cmd-table .cmd.chosen:visible').first().next();
            if ($e.length) $e.click();
        }
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














    //game stuff, maybe move to another js file later
    //here are just tests, call the functions when the certain button is pressed.
    //sock.emit('rollDice', roomId);









    //sock.emit('LOL');



});