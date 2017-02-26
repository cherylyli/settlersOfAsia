
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
    let CircularJSON = window.CircularJSON;

    window.myObj = im.myObj;
    //console.log(window.myObj);
    var roomId = window.location.pathname.split("/").pop();


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
        console.log(room);
    });


    sock.on('NEW_PLAYER_JOINED', function (msg) {
       alert('NEW_PLAYER_JOINED');
       //change ui
    });

    sock.on('GAME_START', function (msg) {
        //entry point for max's code

    });






    // ----------------------------- View Layer ----------------------------- //

    var app = new Vue({
        el: '#page',
        data: {
            me: myObj
        },
        mounted: function(){
            $('body').showV();
        }
    });















    //game stuff, maybe move to another js file later
    //here are just tests, call the functions when the certain button is pressed.
    //sock.emit('rollDice', roomId);









    //sock.emit('LOL');



});