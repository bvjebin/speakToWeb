define(["utils/utils"], function (utils) {
	function CommandProcessor(commandRepo, fuse) {
		var _this = this,
			commandRepo = commandRepo;

		var preprocess = {
			tidyUp: function(commandString) {
				return commandString.trim();
			}
		}

		this.processCommand = function(commandHash) {
			var commandToExecute;
			commandHash.command = preprocess.tidyUp(commandHash.command);

			var commandList = fuse.search(commandHash.command);
			commandToExecute = (commandList || [])[0];
			if(commandToExecute) {
				commandHash.commandObject = commandRepo.getCommandById(commandToExecute);
			} else {
				commandHash.commandObject = commandRepo.getOrphanCommandObject();
			}
			return commandHash;
		};
	};
	return CommandProcessor;
});