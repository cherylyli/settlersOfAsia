$( document ).ready(function () {

    function fieldsEntered(){
        return $('#username').val() && $('#password').val();
    }

    // enable submit button when both fields are entered
    // disable otherwise
    function styleSubmit(){
        if (fieldsEntered()) $('#enter').addClass('enterActive');
        else $('#enter').removeClass('enterActive');
    }

    // when write stuffs in login fields
    $('#username, #password').on('input', styleSubmit);
    styleSubmit();


    // trigger login
    $("#enter").click(login);
    $('#username, #password').keypress(function(e){
        if (e.which == 13 && fieldsEntered()) login();
    });

    // login
    function login(){
        // ensure fields not empty
        var username = $('#username').val();
        var password = $('#password').val();
        if (!username || !password) return;
        $.post('/login', { username: username, password: password }, function(res){
            if (res.error){
                return swal2({ text: res.error });
            }
            window.location.href = '/';
        });
    }

});