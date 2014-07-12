$(document).ready(function() {
	//var socket = io.connect("http://192.168.100.139");
	var socket = io.connect();
	var uid = get_url_vars().uid;

	var voice1 = $("#voice1")[0];
	var voice2 = $("#voice2")[0];
	var voice3 = $("#voice3")[0];
	var voice4 = $("#voice4")[0];
	var voice5 = $("#voice5")[0];
	voice1.load();

	socket.on("tsukkomi", function (data) {
		console.log("uid:" + data.uid);
		//$("#voice")[0].play();
		if (data.uid == "1") {
			voice1.load();
			voice1.play();
			//playAudio('audio/omoitaiko.mp3');
		}
		if (data.uid == "2") {
			voice2.load();
			voice2.play();
		}
		if (data.uid == "3") {
			voice3.load();
			voice3.play();
		}
		if (data.uid == "4") {
			voice4.load();
			voice4.play();
		}
		if (data.uid == "5") {
			voice5.load();
			voice5.play();
		}
		//voice1.load();
		//voice1.play();
	});

	var started = false;

	$("#do-load").on("click", function() {
		//$("#voice")[0].load();
	    voice1.load();
	});

	$("#voice1").on("canplay", function() {
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

function playAudio(path) {
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	var context = new AudioContext();
	var xhr = new XMLHttpRequest();
	var url = path;
	xhr.responseType = 'arraybuffer';

	xhr.onload = function() {
	    if (xhr.status === 200) {
	        var arrayBuffer = xhr.response;
	        if (arrayBuffer instanceof ArrayBuffer) {
	            var successCallback = function(audioBuffer) {
	            };
	            var errorCallback = function() {
	                window.alert('Error : "decodeAudioData" method !!');
	            };
	            context.decodeAudioData(arrayBuffer, successCallback, errorCallback);
	        }
	    }
	};

	xhr.open('GET', url, true);
	xhr.send(null);
}
