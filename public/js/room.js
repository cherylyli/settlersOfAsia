
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
        alert("sfd");
        Commands.exec(CommandName.rollDice, CommandsData.rollDice());
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
    var room = window.room = {users: []};
    

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
        let room = CircularJSON.parse(msg);
        app.room = room;
        app.setMy();
        console.log(room);
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
            logs: [
                { user: null, action: 'The game starts.', system: true },
                { user: 'Yuan', action: 'places a city.', system: true },
                { user: 'jack', action: 'places a road.', system: true },             
                { user: 'Max', action: "stop cheating man", system: false },             
                { user: 'Emol', action: "i aint cheating -_-", system: false }             
            ]
        },
        mounted: function(){
            $('body').showV();
            adjustUI();
            console.log('mounted');
        },
        updated: function(){
            console.log('updated');
            adjustUI();
        },
        filters: {
            capitalize: beautify.capitalize
        },
        methods: {
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
                    $('#log').scrollTop($('#log')[0].scrollHeight);
                });
            },

            // chat in room
            sendMessage: function(){
                var content = $('#log input').val();
                sock.emit('send-message', content);
                $('#log input').val('');
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














    //game stuff, maybe move to another js file later
    //here are just tests, call the functions when the certain button is pressed.
    //sock.emit('rollDice', roomId);









    //sock.emit('LOL');



});