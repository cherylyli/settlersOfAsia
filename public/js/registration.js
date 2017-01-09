
$( document ).ready(function () {

    // return whether or not all required fields are filled
    function fieldsFilled(){
        return ($('#username').val() && $('#password').val());
    }

    // enable button if all required fields are filled
    // disable otherwise
    $('#username, #password, #password2').on('input', function(){
        if (fieldsFilled()) $('#enter').addClass('enterActive');
        else $('#enter').removeClass('enterActive');
    });


    // trigger signup
    $("#enter").click(signup);
    $('#pic, #password, #username').keypress(function(e){
        if (e.which == 13) signup();
    });

    // signup
    function signup(){
        // ensure fields not empty
        var username = $('#username').val();
        var password = $('#password').val();
        var pic      = $('#pic').val() || undefined;
        if (!username || !password) return;
        $.post('/signup', { username: username, password: password, profile_pic: pic }, function(res){
            if (res.error) return swal2({ text: res.error });
            window.location.href = '/';
        });
    }


});