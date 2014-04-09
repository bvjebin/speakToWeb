require.config({
	shim: {
		"fuse": {
			exports: 'Fuse'
		}
	},
	paths: {
		"command": "js/speakToWeb/command",
		"context": "js/speakToWeb/context",
		"recognition": "js/speakToWeb/recognition",
		"speak": "js/speakToWeb/speak",
		"textKeeper": "js/speakToWeb/textKeeper",
		"utils": "js/speakToWeb/utils",
		"fuse": "js/library/fuse"
	}
});
/*
	TODO: developer mode where plugin directs user to add necessary semantics
*/
var speakToWeb = (function() {
	var speakToWeb = {
		version: 0.1,
	};
	var uuid = Math.floor(Math.random.apply([1, 999])*1000);
	var recognition, commandController;
	var options = {	//external options
		keys: ["ctrlKey", 90],
		key: "control z",
		language: "en-IN",
		showPanel: true,
		panelContainer: "#results"+uuid,
	};
	
	speakToWeb.init = function(initOptions) {
		var _this = this;
		options = $.extend(true, options, initOptions);
		createRequiredDom();
		jQuery.expr[":"].contains = jQuery.expr.createPseudo(function(arg) {
		    return function( elem ) {
		        return jQuery(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
		    };
		});
		require(
			[
				"speak/speaker",
				"recognition/recognition",
				"command/commandController",
				"utils/utils",
			], 
			function(Speaker, Recognition, CommandController) {
				speakToWeb.speaker = Speaker;	//Speech library wrapper
				recognition = new Recognition(options);
				recognition.init();
				commandController = new CommandController(options);
				_this.giveCommand = function(str) {
					var processedCommandHash = commandController.processCommand({command: str});
					speakToWeb.speaker(processedCommandHash.speakerText);
				}
				//_this.giveCommand("buddy");
				document.addEventListener("recognitionStart", function(e) {
					speakToWeb.speaker("Hey! I am Jarvis. I'm here to help you.!");
				}, false);
				document.addEventListener("recognitionEnd", function(e) {
					speakToWeb.speaker("Oh! Speech Recognition is down. Restart speach recognition by pressing ctrl z!");
				}, false);
				document.addEventListener("recognitionResult", function(e) {
					var processedCommandHash = commandController.processCommand({command: e.detail.command});
					speakToWeb.speaker(processedCommandHash.speakerText);
				}, false);

			}
		);
		return this;
	};

	var createRequiredDom = function() {
		var panelContainer = document.getElementById(options.panelContainer);
		if(!panelContainer) {
			panelContainer = document.createElement("div");
			panelContainer.id = options.panelContainer;
			panelContainer.style.width = "40%";
			panelContainer.style.position = "fixed";
			panelContainer.style.left = "30%";
			panelContainer.style.top = "3px";
			panelContainer.style.borderRadius = "5px";
			panelContainer.style.boxShadow = "0px 1px 7px 2px #333";
			panelContainer.style.border = "5px solid #888";
			if(options.showPanel !== true) {
				panelContainer.style.display = "none";
			}
			document.getElementsByTagName("body")[0].appendChild(panelContainer);
		}
		var input = document.createElement("input");
		input.id = "final_span";
		input.class = "final";
		input.style.textAlign = "center";
		input.style.background = "#ccc";
		input.style.width = "100%";
		input.style.height = "60px";
		input.readOnly = "readOnly";

		panelContainer.appendChild(input);
		panelContainer.innerHTML += '<span class="interim" id="interim_span"></span>';
		panelContainer.innerHTML += '<div id="audio"></div>';
		document.getElementById("final_span").value = "Command Display Panel";
	};

	// var currentContext = new CurrentContext();

	// var commandExecutionEngine = new CommandExecutionEngine();
	// speakToWeb.executeCommands = commandExecutionEngine.executeCommands;

	return speakToWeb;
})();
$(document).ready(function($) {
	/*speak("welcome to speaktoweb. I am Jarvis at your service.");
	window.speakToWeb = {};
	speakToWeb.recognition = {};
	speakToWeb.utils = {};
	speakToWeb.dom = {};

	speakToWeb.dom.final_transcript = document.getElementById("final_span");
	speakToWeb.dom.interim_transcript = document.getElementById("interim_span");

	speakToWeb.utils.linebreak = function(s) {
		var two_line = /\n\n/g;
		var one_line = /\n/g;
		return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
	}
	speakToWeb.utils.capitalize = function(s) {
		var first_char = /\S/;
		return s.replace(first_char, function(m) { return m.toUpperCase(); });
	}
	
	speakToWeb.recognition.interim_transcript = "";
	speakToWeb.recognition.recognizing = false;
	speakToWeb.recognition.final_transcript = "";
	speakToWeb.recognition.listen = false;

	speakToWeb.recognition.setListening = function(listen) {
		speakToWeb.recognition.listen = listen;
	};
	speakToWeb.recognition.isListening = function(listen) {
		speakToWeb.recognition.listen = listen;
	};
	speakToWeb.executeCommands = function(text) {
		var cleanText = (text || "").trim().toLowerCase();
		if(cleanText == "clear that") {
			speakToWeb.dom.final_transcript.innerHTML = "";
		}
		if(/go to link/.test(cleanText)) {
			var location = cleanText.replace("go to link", "");
			var anchor = $("a:contains('"+location+"')");
			if(!anchor) {
				speak("No link found with text "+cleanText);	
			} else {
				speak("Going to link "+anchor.text());
				window.location.href = anchor.attr("href");
			}
		}
	}

	var recognition;
	
	if (!('webkitSpeechRecognition' in window)) {
		upgrade();
		speak("No Speech recognition available in your browser. Please upgrade to latest version");
	} else {
		recognition = new webkitSpeechRecognition();
		recognition.continuous = true;
		recognition.interimResults = true;

		recognition.onstart = function() {
			speakToWeb.recognition.recognizing = true;
			document.getElementById("started").innerHTML = "Started";
			speak("Speech recognition started");
		}
		recognition.onend = function() {
			document.getElementById("started").innerHTML = "Ended";
			speak("Speech recognition ended. Press Ctrl Z to start speech recognition again");
		}
		recognition.onresult = function(event) {
			speak("Recognition in progress");
			speakToWeb.recognition.final_transcript = "";
			speakToWeb.recognition.interim_transcript = "";
			for (var i = event.resultIndex; i < event.results.length; ++i) {
				if (event.results[i].isFinal) {
					speakToWeb.recognition.final_transcript += event.results[i][0].transcript;
				} else {
					speakToWeb.recognition.interim_transcript += event.results[i][0].transcript;
				}
			}
			speakToWeb.recognition.final_transcript = speakToWeb.utils.capitalize(speakToWeb.recognition.final_transcript);
			document.getElementById("final_span").innerHTML = speakToWeb.utils.linebreak(speakToWeb.recognition.final_transcript);
			document.getElementById("interim_span").innerHTML = speakToWeb.utils.linebreak(speakToWeb.recognition.interim_transcript);
			speakToWeb.executeCommands(speakToWeb.recognition.final_transcript);
			speak("Recognition endded");
		};
		recognition.onerror = function(event) { 
			speak("Error occurred in recognition.");
		}
	}
	if(speakToWeb.recognition.recognizing === false) {
		recognition.start();
	}
	$(document).keyup(function(event) {
		if(event.keyCode == 90 && event.ctrlKey) {
			if(speakToWeb.recognition.recognizing === true) {
				recognition.stop();
			}
			speakToWeb.recognition.final_transcript = '';
			recognition.lang = "en-IN";
			recognition.start();
			document.getElementById("final_span").innerHTML = '';
			document.getElementById("interim_span").innerHTML = '';
		}
	});*/
	speakToWeb.init();
});