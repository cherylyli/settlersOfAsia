
$(document).ready(function(){

	// socket.emit('test', 'hello');


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

	firebase.database().ref('rooms').on("value", function(snapshot){
		if (!snapshot.val()) return;
		var rooms = snapshot.val();
		var room_list = "<br>";
		for (var key in rooms){
			let room = rooms[key];
			let room_html = "<div class='rooms'><h2 class='gameName'>";
			room_html += room.roomName;
			room_html += "</h2><div class='numplayers'>"
			room_html += room.players.length + " players</div><div class='currentstate'>Waiting for ";
			room_html += 4 - room.players.length;
			room_html += ' more player(s)</div><button id="' + key + '" class="enterroom">Enter Room</button></div>'
			room_list += room_html;

		};
		console.log(room_list);

		$('#findrooms').html(room_list);
		$(".enterroom").click(function(){
			console.log($(this).attr('id'));
			data = {
				userid: userid,
				roomid: $(this).attr('id')
			};
			var url = "http://localhost:3000/game/" + $(this).attr('id');

			$.ajax({
				url: '/enterRoom',
				method: "PUT",
				data: data
			}).done(function(res){
				console.log(res);
				
				if (res){
					$(location).attr("href", url);
				}
			});
		});
		/*<h2>Template room: would be populated with javascript, with ID being the id of the room in firebase</h2>
				<div class="rooms">
					<h2 class="gameName">AwesomeGame</h2>
					<div class="numplayers">3 players</div>
					<div class="currentstate">Waiting for 1 more player</div>
					<button class="enterroom">Enter Room</button>

				</div>*/

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
		data.userid = userid;
		console.log(data);
		//send to backend 
		$.ajax({
			url: '/addRoom',
			method: "PUT",
			data: data
		}).done(function(res){
			console.log(res.body);
		});
	});




});

