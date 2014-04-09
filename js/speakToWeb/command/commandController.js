define(
	[
		"command/commandRepo",
		"command/commandProcessor",
		"command/commandExecutor",
		"textKeeper/textKeeper",
		//"context/contextManager",
		"utils/utils",
		"fuse"
	], 
	function(CommandRepo, CommandProcessor, CommandExecutor, TextKeeper, /*ContextManager,*/ utils) {
		function CommandController(options) {
			var commandRepo = new CommandRepo,
				textKeeper = new TextKeeper(options),
				//contextManager = new ContextManager;

			var fuse = new Fuse(commandRepo.commandList, {keys: ["command", "aliases"], id: 'id', threshhold: 0.1});
			var commandProcessor = new CommandProcessor(commandRepo, fuse),
				commandExecutor = new CommandExecutor(textKeeper);

			this.processCommand = function(commandHash) {
				//contextManager.setContext(commandHash);
				var processedCommandHash = commandProcessor.processCommand(commandHash);
				commandExecutor.commandController = this;	//to be used in case of orphan commands
				commandExecutor.executeCommand(processedCommandHash);

				//load all necessary details to commandHash
				processedCommandHash.speakerText = textKeeper.getText(processedCommandHash)
				return processedCommandHash;
			};
		}
		return CommandController;
	}
);