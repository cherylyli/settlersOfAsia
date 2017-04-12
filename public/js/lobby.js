
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



    // helpers
    function sortObject(o) {
        return Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {});
    }



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
        // for each spot, (max 4 spots)
        for (var i=0; i<4; i++){
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

    // go to room when click on link
    $(document).on('click', '#onlines .snippet.pseudo-link', function(){
        var roomId = $(this).closest('[data-roomid]').attr('data-roomid');
        window.location.href = `/room/${roomId}`;
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






    // -------------------------- make room --------------------------

    // edit match name
    function randomMatchName(){
        var n = myObj.username;
        var nameBank = [n+"'s match.", n+" is steadily killin' fools.", n+" much?", n+"'s Maj0r Pwn4ge.", "Drunken master, "+n+'.',
        "Is "+n+" awesome? (y/y)", n+". Kid tested, mother approved.", "Stay classy, stay "+n+".", "Girl you know it's true, "+n+" loves you.",
        n+" lifts heavy.", "Good time with "+n+".", "They see "+n+" ridin' they hatin'.", "Keyboard warrior, "+n, "I'd shave for "+n+'.',
        n+". He simply walks into Mordor."];
        return _.sample(nameBank);
    }

    // make random 5 character string
    function makeId(){
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for( var i=0; i < 5; i++ ) text += possible.charAt(Math.floor(Math.random() * possible.length));
        // FIXME : change later
        // return "piaKP";
        return text;
    }

    // prefill room name
    $('#editMatch_name_input').val(randomMatchName());

    // show make room popup
    $('#create').click(function(){
        $('#editMatchPop').showPop({ fadeIn: true,fadeDuration: { pop: 150, overlay: 200 } });
    });

    // change room name
    $("#editMatch_name_refresh").click(function(){
        $('#editMatch_name_input').val(randomMatchName());
    });

    // actually make room
    $('#editMatchPop .pop_save').click(function(){
        var roomId = makeId();
        var roomName = $('#editMatch_name_input').val();
        var scenario = $('#editMatch_type select').val();
        var config = {
            roomId: roomId,
            gameScenario: scenario, // 123
            roomName: roomName
        };
        window.location.href = `/room/${roomId}?config=${encodeURIComponent(JSON.stringify(config))}`;
    });








    // -------------------------- open saved room --------------------------

    $('#open').click(function(){
        updateSavedGameList();
        $('#open-saved-pop').showPop({ fadeIn: true,fadeDuration: { pop: 150, overlay: 200 } });
    });

    var openSavedPop = new Vue({
        el: '#open-saved-pop',
        data: {
            rooms: [{name:'some bullshit', id: '123'}]
        }
    })

    function updateSavedGameList(){
        $.get('/saved', function(rooms){
            if (!_.isEmpty(rooms)) openSavedPop.rooms = rooms;
        });
    }
    updateSavedGameList();












    // -------------------------- refresh room list --------------------------

    // fetch all rooms from server, and display them on screen
    function fetchRooms(){
        $.get('/rooms', function(rooms){
            rooms = CircularJSON.parse(rooms);
            _.each(rooms, function(room, id){
                room.host = room.owner;
                room.type = room.gameScenario;
                room.players = _.map(_.values(room.users), function(u){
                    return u.user;
                });
                if (_.isEmpty(room.players)) delete rooms[id];
            });
            renderMatches(rooms);
        });
    }

    // refresh room list every second
    fetchRooms();
    setInterval(fetchRooms, 1000);


    // fetch all online users from server, and display them on screen
    function fetchOnlines(){
        $.get('/users', function(users){
            users = sortObject(users);
            renderOnlines(users);
        });
    }

    // refresh online list every second
    fetchOnlines();
    setInterval(fetchOnlines, 1000);

});