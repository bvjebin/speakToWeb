/*
	File Name: speaker.js
	Class Name: Speaker
	Description: Speaks the text with options provided
*/

define( ["speak/speakClient"], function() {
	function Speaker(text) {
		//speak(text);
		if(!Speaker.voicesAvailable) {
			var watch = setInterval(function() {
				Speaker.voicesAvailable = speechSynthesis.getVoices();
				if (Speaker.voicesAvailable.length !== 0) {
					clearInterval(watch);
					speak();
				}
			}, 1);
			return false;
		}
		speak();
		function speak() {
			Speaker.speechUtterence = Speaker.speechUtterence || new SpeechSynthesisUtterance(text);
			Speaker.speechUtterence.voice = Speaker.voicesAvailable[1];
			Speaker.speechUtterence.text = text;
			Speaker.speechUtterence.lang = Speaker.options.language;
			Speaker.speechUtterence.volume = 5;
			Speaker.speechUtterence.onerror = function(e) {
				console.error(e);
			}
			window.speechSynthesis.speak(Speaker.speechUtterence);
		}

		return Speaker;
	}
	return Speaker;
});