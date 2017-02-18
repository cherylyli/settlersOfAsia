
// set up environment
$(document).ready(function(){
    var evt = $.Event('imready');

    // Fetch my data from server
    $get('/mydata', function(data){

        // if not logged in, redirect to login
        if (!data) return window.location.href = '/login';
        evt.myObj = data;

        // show page
        $('body').showV();
        $(window).trigger(evt);
    });
});


// upon environment set up
$(window).on('imready', function(im){

    window.myObj = im.myObj;
    var roomId = window.location.pathname.split("/").pop();


    // on page load, join room
    sock.emit('JOIN_ROOM', roomId);

    //test data
    let mapConfig = {'scenario':'Heading For New Shores'};
    sock.emit('MAP_CONFIG', mapConfig);

    // when sock disconnects and reconnects, join room again
    sock.on('reconnect', function(){
        sock.emit('JOIN_ROOM', roomId);
    });

    // upon successfully joined room, server will send back a message
    sock.on('JOIN_ROOM_SUCCESS', function(msg){
        alert(msg);
        console.log(msg);
    });

    //sock.emit('LOL');



});