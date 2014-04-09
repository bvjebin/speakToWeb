/*
	File Name: commandRepo.js
	Class Name: CommandRepo
	Description: Look up command dictionary
*/

define(["utils/utils"], function(utils) {
	function CommandRepo() {
		var _this = this;
		//Singleton pattern
		if(CommandRepo.prototype._instance) {
			return CommandRepo.prototype._instance;
		}
		CommandRepo.prototype._instance = this;

		this.commandCategory = {
			NAVIGATION: "navigation",
			WRITE: "write",
			ACTION: "action",
			LAYOUT: "layout",
			SALUTATION: "salutation",
			DESCRIPTIVE: "descriptive",
			CONTEXTUAL: "contextual",
			ORPHAN: "orphan"
		};

		var commandIterator = function(id) {
			var command;
			_this.commandList.forEach(function(item) {
				if(id == item.id) {
					command = item;
					return false;
				}
			});
			return command;
		};

		this.getCommandById = function(id) {
			var command;
			if(!id) {
				id = "command_invalid";
				utils.logger("No id passed");
				return;
			}
			command = commandIterator(id);
			if(!command) {
				id = "command_invalid";
				utils.logger("Command not found");
				command = commandIterator(id);
			}
			return command;
		};

		this.getOrphanCommandObject = function () {
			return {
				id: "orphan_command_doubtful",	//command without any context(link or form) from user
				category: this.commandCategory.ORPHAN,
				command: "orphan"
			};
		};

		this.commandList = [
			{
				id: "go_to_link",
				category: this.commandCategory.NAVIGATION,
				command: "go to link"
			},
			{
				id: "go_to_form",
				category: this.commandCategory.NAVIGATION,
				command: "go to form"
			},
			{
				id: "go_to_field",
				category: this.commandCategory.NAVIGATION,
				command: "go to field"
			},
			{
				id: "go_to_combobox",
				category: this.commandCategory.NAVIGATION,
				command: "go to combo box"
			},
			{
				id: "open_link",
				category: this.commandCategory.NAVIGATION,
				command: "open link"
			},
			{
				id: "type_text",
				category: this.commandCategory.WRITE,
				command: "type text"
			},
			{
				id: "submit_form",
				category: this.commandCategory.NAVIGATION,
				command: "submit form"
			},
			{
				id: "click_it",
				category: this.commandCategory.ACTION,
				command: "click it",
				aliases: ["click that", "press"]
			},
			{
				id: "clear_that",
				category: this.commandCategory.ACTION,
				command: "clear that",
				aliases: ["clear it", "clear this"]
			},
			{
				id: "select_that",
				category: this.commandCategory.ACTION,
				command: "select that",
				aliases: ["select it", "select this"],
				run: function() {
					if(currentElement.tagName == "INPUT" || currentElement.tagName == "TEXTAREA") {
						if(window.getSelection && window.getSelection().toString() != "") {
							currentElement.value.replace(window.getSelection().toString(),"");
						} else {
							currentElement.value = "";
						}
					}
				}
			},
			{
				id: "get_layout",
				category: this.commandCategory.LAYOUT,
				command: "get layout"
			},
			{
				id: "read_it",
				category: this.commandCategory.DESCRIPTIVE,
				command: "read it",
				aliases: ["read that", "read"]
			},
			{
				id: "read_it_again",
				category: this.commandCategory.DESCRIPTIVE,
				command: "read it again"
			},
			{
				id: "next",
				category: this.commandCategory.ACTION,
				command: "next"
			},
			{
				id: "previous",
				category: this.commandCategory.ACTION,
				command: "previous"
			},
			{
				id: "what_to_do",
				category: this.commandCategory.DESCRIPTIVE,
				command: "what to do"
			},
			{
				id: "hi_jarvis",
				category: this.commandCategory.SALUTATION,
				command: "hi jarvis, hello",
				aliases: ["hi", "hey", "hey jarvis", "jarvis", "buddy", "Jarvis there"]
			},
			{
				id: "again",
				category: this.commandCategory.CONTEXTUAL,
				command: "again",
				aliases: ["repeat it"]
			},
			{
				id: "scroll_up",
				category: this.commandCategory.ACTION,
				command: "scroll up",
				aliases: ["move up"]
			},
			{
				id: "scroll_top",
				category: this.commandCategory.ACTION,
				command: "scroll top",
				aliases: ["move top", "top", "go to top"]
			},
			{
				id: "scroll_down",
				category: this.commandCategory.ACTION,
				command: "scroll down",
				aliases: ["move down"]
			},
			{
				id: "scroll_last",
				category: this.commandCategory.ACTION,
				aliases: ["move last", "last", "go to last"],
				command: "scroll last"
			}
		];


	};
	return CommandRepo;
});