var userid;

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
  	//also, remove the login stuff and replace it with hi user
    console.log("User is logged in!");
    $(".notsignedin").hide();
    $(".signed-in").show();
    userid = user.uid;

  } else {
    console.log("No user logged in! :(");
    $(".notsignedin").show();
    $(".signed-in").hide();
    userid = undefined;
  }
});

$("#login").submit(function(event){
	event.preventDefault();
	var email = $('input[name="loginemail"]').val();
	var password = $('input[name="loginpassword"]').val();
	firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
  		
  		if (error){
  			alert(error.message);
  		} else {
  			$('input[name="loginemail"]').val("");
  			$('input[name="loginpassword"]').val("");
  		}
  		// ...
	});
})

$('#signout').click(function(event){
	event.preventDefault();
	firebase.auth().signOut();
})

//toggle the find room and add new room tabs
$('#labelfindroom').click(function(){
	$('#labelfindroom').addClass('selected');
	$('#labelnewroom').removeClass('selected');
	$('#addroom').hide();
	$('#findrooms').fadeIn();
});

$('#labelnewroom').click(function(){
	$('#labelfindroom').removeClass('selected');
	$('#labelnewroom').addClass('selected');
	$('#findrooms').hide();
	$('#addroom').fadeIn();
});

//stuff for adding a room
$('#createroomform').submit(function(event){
	event.preventDefault();
	var data = $('#createroomform').serializeArray().reduce(function(obj, item) {
	    obj[item.name] = item.value;
	    return obj;
	}, {});
	console.log(data);
	//send to backend 
	$.ajax({
		url: '',
		method: "PUT",
		data: data
	}).done(function(res){

	});
});

