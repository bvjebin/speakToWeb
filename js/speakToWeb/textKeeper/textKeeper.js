define(["utils/utils"], function(utils) {
	function TextKeeper(options) {
		if(TextKeeper.prototype._instance) {
			return TextKeeper.prototype._instance;
		}
		TextKeeper.prototype._instance = this;
		
		this.textConstants = {};
		
		this.textConstants.KEEP_QUIET = "KEEP_QUIET";

		this.textConstants.HI_JARVIS = "HI_JARVIS";
		this.textConstants.HI = "HI";
		this.textConstants.HELLO = "HELLO";
		this.textConstants.JARVIS = "JARVIS";
		this.textConstants.SCROLL_UP = "SCROLL_UP";
		this.textConstants.SCROLL_DOWN = "SCROLL_DOWN";
		this.textConstants.SCROLL_TOP = "SCROLL_TOP";
		this.textConstants.SCROLL_LAST = "SCROLL_LAST";

		var questions = {

		};

		var answers = {};
		answers[this.textConstants.HI_JARVIS] = "Hello User";
		answers[this.textConstants.HI] = "You can call me Jarvis";
		answers[this.textConstants.HELLO] = "Hey User";
		answers[this.textConstants.JARVIS] = "Yes, how can I help you?";
		answers[this.textConstants.SCROLL_UP] = "Scrolled a bit up";
		answers[this.textConstants.SCROLL_DOWN] = "Scrolled a bit down";
		answers[this.textConstants.SCROLL_TOP] = "Reached top of the page";
		answers[this.textConstants.SCROLL_LAST] = "Reached end of the page";

		var texts = {
			"SPEECH_RECOGNITION_STARTED": "Speech Recognition Started",
			"SPEECH_RECOGNITION_ENDED": "Speech Recognition Ended",
			"PRESS_KEY_TO_START": "Press "+options.key+ " to restart speech recognition",
			"ERROR_IN_SPEECH_RECOGNITION": "Error occurred in speech recognition"
		};
		this.getText = function(commandHash) {
			var text, SPEECH_IDENTIFIER = commandHash.speakerCode;
			if(this.textConstants.KEEP_QUIET == SPEECH_IDENTIFIER) {
				text = commandHash.speakerText;
			} else if(texts[SPEECH_IDENTIFIER]) {
				text = texts[SPEECH_IDENTIFIER];
			} else if(answers[SPEECH_IDENTIFIER]) {
				text = answers[SPEECH_IDENTIFIER];
			} else if(questions[SPEECH_IDENTIFIER]) {
				text = questions[SPEECH_IDENTIFIER];
			} else {
				text = this.noUnderstand();
			}
			return text;
		};
		this.noUnderstand = function() {
			return "Apologize me. I don't understand your question. Try in some other way.";
		}
	}
	return TextKeeper;
});