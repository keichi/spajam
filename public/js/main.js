$(document).ready(function() {
	//var socket = io.connect("http://192.168.100.139");
	var socket = io.connect();
	var uid = get_url_vars().uid;

	var voice = $("#voice")[0];
	var voice2 = $("#voice2")[0];
	voice.load();

	socket.on("tsukkomi", function (data) {
		console.log("uid:" + data.uid);
		//$("#voice")[0].play();
		if (data.uid == "A") {
			voice.load();
			voice.play();
		}
		if (data.uid == "B") {
			voice2.load();
			voice2.play();
		}
	});

	var started = false;

	$("#do-load").on("click", function() {
		//$("#voice")[0].load();
	    voice.load();
	});

	$("#voice").on("canplay", function() {
		started = true;
		$("#do-load").remove();
	})

	$("#do-tsukkomi").on("click", function() {
		if (started) {
			socket.emit("tsukkomi", {
				uid: uid
			});
		}
	});

	var zs = [];
	var LENGTH = 15;
	var state = {moving : 0, stop : 1, other : 2};
	var start = new Date(), end;
	var nowState = state.other;
	var samplingtime;
	var THRESHOLD = 0.3;	// m/s
	var prevVelocity = 0;
	var velocity = 0;

	window.addEventListener("devicemotion",function(evt){
		if(nowState == state.stop)
		{
			setTimeout(function() {
				socket.emit("tsukkomi", {
					uid: uid
				});
			});
			nowState = state.other;
			prevVelocity = velocity = 0;
		}
		if(zs.length >=  LENGTH)
			zs.shift();
		zs.push(evt.acceleration.z);

		end = new Date();
		samplingtime = 0.001*(end.getTime()-start.getTime());
		if(samplingtime < 0.05)
			return;

		velocity = 0;
		for(var i = 0; i < LENGTH; i++)
		{
			velocity += zs[i]*samplingtime;
		}
		if(Math.abs(velocity) > THRESHOLD)
		{
			nowState = state.moving;
		}
		if(prevVelocity*velocity <= -0.038 && nowState == state.moving)
			nowState = state.stop;

		start = end;
		prevVelocity = velocity;

		$("#result").html("");
    },false);
});

function get_url_vars()
{
  var vars = new Object, params;
  var temp_params = window.location.search.substring(1).split('&');
  for(var i = 0; i <temp_params.length; i++) {
    params = temp_params[i].split('=');
    vars[params[0]] = params[1];
  }
  return vars;
}