/*
	File Name: speaker.js
	Class Name: Speaker
	Description: Speaks the text with options provided
*/

define(/*["speak/speakClient"],*/function() {
	function Speaker(text, options) {
		//speak(text, options);
		this.speechUtterence = this.speechUtterence || new SpeechSynthesisUtterance(text);
		this.speechUtterence.voice = window.speechSynthesis.getVoices()[1];
		this.speechUtterence.text = text;
		window.speechSynthesis.speak(this.speechUtterence);

		return this;
	}
	return Speaker;
});