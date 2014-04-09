define(function() {
	function ContextManager() {
		if(ContextManager.prototype._instance) {
			return ContextManager.prototype._instance;
		}
		ContextManager.prototype._instance = this;
		
		var _this = this;
		var _commandHash, _currentElement, _previousElement, 
			_isContextSet, _isCommandInComplete;
		
		this.clearContext = function() {
			_commandHash = null;
			_currentElement = null;
			_previousElement = null;
			_isContextSet = false;
			_isCommandInComplete = false;
		};

		this.setContext = function(commandHash, currentElement) {
			_commandHash = $.extend(true, {}, commandHash);
			_previousElement = _currentElement;
			_currentElement = currentElement;
			_isContextSet = true;
		};

		this.isContextSet = function() {
			return _isContextSet;
		};

		this.setCommandInComplete = function(isCommandInComplete) {
			_isCommandInComplete = isCommandInComplete;
		};

		this.isCommandInComplete = function() {
			return _isCommandInComplete;
		};

		this.getContext = function() {
			return {
				commandHash: _commandHash,
				previousElement: _previousElement,
				currentElement: _currentElement,
				isCommandInComplete: _isCommandInComplete
			};
		};
	};
	return ContextManager;
});