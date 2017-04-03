
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
    console.log(myObj);





    // ---------------------------- models ----------------------------

    // list of matches
    var matches = {
        'a': {
            id: 'a',
            host: 'Jack',
            name: "Girl you know it's true, Jack loves you.",
            type: "Basic",
            players: [
                { username: 'Jack', profile_pic: '/bulk/m1.jpeg' },
                { username: 'Emol', profile_pic: '/bulk/f1.jpeg' },
                { username: 'Cher', profile_pic: '/bulk/f2.jpeg' },
                { username: 'Yuan', profile_pic: '/bulk/f3.jpeg' },
                { username: 'Max',  profile_pic: '/bulk/m2.jpeg' }
            ]
        },
        'b': {
            id: 'b',
            host: 'Emol',
            name: "Emol's Maj0r Pwn4ge.",
            type: "Airfare",
            players: [
                { username: 'Emol', profile_pic: '/bulk/f1.jpeg' },
                { username: 'Max',  profile_pic: '/bulk/m2.jpeg' }
            ]
        },
        'c': {
            id: 'c',
            host: 'Cher',
            type: "Seafare",
            name: "Cheryl. He simply walks into Mordor.",
            players: [
                { username: 'Jack', profile_pic: '/bulk/m1.jpeg' },
                { username: 'Cher', profile_pic: '/bulk/f2.jpeg' },
            ]
        }
    };

    // list of online users
    var onlines = {
        'jack'  : { username: 'Jack', profile_pic: '/bulk/m1.jpeg', status: 'La vie on rose' },
        'Emol'  : { username: 'Emol', profile_pic: '/bulk/f1.jpeg', status: 'Just chilling' },
        'Cher'  : { username: 'Cher', profile_pic: '/bulk/f2.jpeg', status: 'Nuthin' },
        'Yuan'  : { username: 'Yuan', profile_pic: '/bulk/f3.jpeg', status: 'Playing Settlers hardcore' },
        'Max'   : { username: 'Max',  profile_pic: '/bulk/m2.jpeg', status: 'praying 4 haramblez' }
    };






    // ---------------------------- views ----------------------------

    // bind my data
    $('.topbar .welcome').text('Welcome, ' + myObj.username + '!');
    $('.topbar .pic').setBgUrl(myObj.profile_pic);

    // return a single match
    function createMatch(match){
        var match_template = $('#match-template').html();
        var player_template = $('#match-player-template').html();
        // match skeleton
        var host = _.findWhere(match.players, { username: match.host });
        var $match = $(_.template(match_template)({ match: match, host: host }));
        // add players
        var $players = $match.find('.players').empty();
        // for each spot, (max 8 spots)
        for (var i=0; i<8; i++){
            var player = match.players[i];
            var $player = $(_.template(player_template)({ player: player || {} }));
            // if taken by a player, put his picture; else it's gray by default
            if (player) $player.setBgUrl(player.profile_pic);
            else $player.removeAttr('data-username');
            $players.append($player);
        }
        return $match;
    }

    // render match list on screen
    function renderMatches(matches){
        var $p = $('#rooms .matches').empty();
        _.each(matches, function(match, id){
            $p.append(createMatch(match));
        });

    }

    // display username on hover pic
    $('#rooms').on('mouseover', '.pic[data-username], .player[data-username]', function(event){
        $(this).qtip({
            overwrite: false, show: { event: event.type, ready: true },
            content: { text: function(){
                return $(this).attr('data-username')
            }},
            position: { my: 'bottom center', at: 'top center' },
            style: { classes: 'qtip-light qtip-custom' }
        }, event);
    });

    // render list of online users on screen
    function renderOnlines(users){
        var template = $('#online-user-template').html();
        var $list = $('#onlines .pop_list').empty();
        _.each(users, function(user){
            var $user = $(_.template(template)({ user: user }));
            $list.append($user);
        });
        $('#online-count').text(_.size(users));
    }






    // -------------------------- controllers --------------------------

     // edit match name
    function generateMatchName(){
        var n = myObj.username;
        var nameBank = [n+"'s match.", n+" is steadily killin' fools.", n+" much?", n+"'s Maj0r Pwn4ge.", "Drunken master, "+n+'.',
        "Is "+n+" awesome? (y/y)", n+". Kid tested, mother approved.", "Stay classy, stay "+n+".", "Girl you know it's true, "+n+" loves you.",
        n+" lifts heavy.", "Good time with "+n+".", "They see "+n+" ridin' they hatin'.", "Keyboard warrior, "+n, "I'd shave for "+n+'.',
        n+". He simply walks into Mordor."];
        return _.sample(nameBank);
    }

    function refreshRooms(){
        $.get('/rooms', function(rooms){
            console.log(1, rooms)
            _.each(rooms, function(room, id){
                room.host = room.owner;
            });
            // renderMatches(rooms);
        }); 
    }

    refreshRooms();
    // setInterval(refreshRooms, 1000);

    renderMatches(matches);
    renderOnlines(onlines);

    // make room
    $('#create').click(function(){
        var room_name = generateMatchName();
        console.log(room_name)
    });

});