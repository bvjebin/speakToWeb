/*
	File Name: recognition.js
	Class Name: Recognition
	Description: Recognition Module for SpeakToWeb
*/

define(["utils/utils"], function(utils) {
	function Recognition(options) {
		var _this = this;
		var recognition = {},
			recognizing = false,
			interim_transcript = "",
			final_transcript = "",
			listen = false;

		var eventRecognitionStart = new CustomEvent("recognitionStart"),
			eventRecognitionEnd = new CustomEvent("recognitionEnd"),
			eventRecognitionError = new CustomEvent("recognitionError");

		//todo: provide browser compatibility abstraction
		var getSpeechRecognitionInstance = function() {
			return new webkitSpeechRecognition();
		};
		var setListening = function(listen) {
			listen = listen;
		};
		var isListening = function() {
			return listen;
		};
		var setRecognizing = function(recog) {
			recognizing = recog;
		};
		var isRecognizing = function() {
			return recognizing;
		};

		this.recognitionDOMWrite = function(final_span, interim_span) {
			document.getElementById("final_span").value = (final_span || "");
			document.getElementById("interim_span").innerHTML = (interim_span || "");
		};

		var utils = {
			linebreak: function(s) {
				var two_line = /\n\n/g;
				var one_line = /\n/g;
				return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
			},
			capitalize: function(s) {
				var first_char = /\S/;
				return s.replace(first_char, function(m) {
					return m.toUpperCase();
				});
			}
		};


		var bindEvent = function() {
			if (recognizing === false) {
				recognition.start();
			}
			$(document).keyup(function(event) {
				if (event.keyCode == 90 && event.ctrlKey) {
					if (recognizing === true) {
						recognition.stop();
					}
					final_transcript = '';
					recognition.start();
					_this.recognitionDOMWrite();
				}
			});
		};

		var recognitionNotification = function(text) {
			if (document.getElementById("final_span")) {
				document.getElementById("final_span").value = text;
			}
		}

		var bindRecognitionActions = function() {
			recognition.lang = options.language;
			recognition.continuous = true;
			recognition.interimResults = true;
			var lastStartedAt;
			recognition.onstart = function() {
				setRecognizing(true);
				recognitionNotification("Speech recognition started!");
				document.dispatchEvent(eventRecognitionStart);
				lastStartedAt = new Date().getTime()
			}
			recognition.onend = function() {
				recognitionNotification("Speech recognition ended!");
				var timeSinceLastStart = new Date().getTime()-lastStartedAt;
				if (timeSinceLastStart < 1000) {
					setTimeout(recognition.start, 1000 - timeSinceLastStart);
				} else {
					recognition.start();
				}
				//speakToWeb.speaker("Speech recognition ended. Press Ctrl Z to start speech recognition again");
				document.dispatchEvent(eventRecognitionEnd);
			}
			/*recognition.onresult = function(event) {
				//speakToWeb.speaker("Recognition in progress");
				final_transcript = "";
				interim_transcript = "";
				for (var i = event.resultIndex; i < event.results.length; ++i) {
					if (event.results[i].isFinal) {
						final_transcript += event.results[i][0].transcript;
						//move dom writing		
						_this.recognitionDOMWrite(utils.linebreak(final_transcript), utils.linebreak(interim_transcript));
						var eventRecognitionResult = new CustomEvent("recognitionResult", {
							detail: {
								command: utils.linebreak(final_transcript)
							},
							bubbles: true,
							cancelable: true
						});
						document.dispatchEvent(eventRecognitionResult);
					} else {
						interim_transcript += event.results[i][0].transcript;
						_this.recognitionDOMWrite(utils.linebreak(final_transcript), utils.linebreak(interim_transcript));
					}
				}
				//final_transcript = utils.capitalize(final_transcript);
			};*/
			recognition.onresult = function(event) {
				var results = event.results[event.resultIndex];
				var commandText = "";
				for (var i = 0; i < results.length; i++) {
					if(results.isFinal) {
						commandText = results[i].transcript.trim();
					}
				}
				if(commandText) {
					_this.recognitionDOMWrite(utils.linebreak(commandText));
					var eventRecognitionResult = new CustomEvent("recognitionResult", {
						detail: {
							command: utils.linebreak(commandText)
						},
						bubbles: true,
						cancelable: true
					});
					document.dispatchEvent(eventRecognitionResult);
				}
			};
			recognition.onerror = function(event) {
				setRecognizing(false);
				document.dispatchEvent(eventRecognitionError);
				//speakToWeb.speaker("Oops something went wrong. error in recognition.");
			}
		};

		var isSpeechRecognitionAvailable = function() {
			if (!('webkitSpeechRecognition' in window)) {
				return false;
			} else {
				return true;
			}
		};

		var readNoSpeechRecognitionAvailable = function() {
			speakToWeb.speaker("No Speech recognition available in your browser. Please use some some modern version");
		};

		this.init = function() {
			recognition = getSpeechRecognitionInstance();
			if (recognition) {
				bindRecognitionActions();
				recognition.start();
				setRecognizing(true);
				bindEvent();
			} else {
				readNoSpeechRecognitionAvailable();
			}
		}
	}
	return Recognition;
});