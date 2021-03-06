define(["utils/utils", "context/contextManager"], function(utils, ContextManager) {
	function CommandExecutor(textKeeper) {
		var _this = this;
		var contextManager = new ContextManager();
		this.commandActions = {
			command_invalid: function() {
				return "invalid command";
			},
			orphan_command_doubtful: function() {
				//fuzzy search
				executeOrphanCommandWithContext(_this.commandHash.command);
			},
			orphan_command_real: function() {
				var command = _this.commandHash.command,
					anchors = $("a:contains('"+command+"')"),
					buttons = $("button:contains('"+command+"')"),
					labels = $("label:contains('"+command+"')"),
					selects = $("select:contains('"+command+"')");

				if(anchors.length || buttons.length || labels.length || selects.length) {
					if(anchors.length+buttons.length+labels.length+selects.length > 1) {
						//say ambiguity
						//set in context
					} else {
						return doAction();
					}
				} else {
					return textKeeper.textConstants.INVALID;
				}
				function doAction() {
					if(anchors.length) {
						window.location.href = $(anchors).attr('href');
						var win = window.open($(anchors).attr('href'), '_blank');
  						win.focus();
						_this.commandHash.speakerText = "Link opened in a new tab";
					} else if(buttons.length) {
						$(buttons).focus();
						_this.commandHash.speakerText = "Focussed on button "+command;
					} else if(selects.length) {
						$(selects).focus();
						_this.commandHash.speakerText = "Focussed on combo box "+command;
					}
					
					return textKeeper.textConstants.KEEP_QUIET;
				}
			},
			go_to: function() {
				var rest_of_the_command = getNeedle(_this.commandHash.command),
					linkIndex = rest_of_the_command.indexOf("link"),
					fieldIndex = rest_of_the_command.indexOf("field"),
					formIndex = rest_of_the_command.indexOf("form"),
					comboIndex = rest_of_the_command.indexOf("combo");
				if(linkIndex > 0) {
					this.go_to_link();
				} else if(fieldIndex > 0) {
					this.go_to_field();
				} else if(formIndex > 0) {
					this.go_to_form();
				} else if(comboIndex > 0) {
					this.go_to_combobox();
				} else {
					this.orphan_command_real();
				}
			},
			go_to_link: function() {
				var location = getNeedle(_this.commandHash.command);
				if(location) {
					var $anchor = $("a:contains('"+location+"')");
					if(!$anchor.length) {
						_this.commandHash.speakerText = "No link found with text "+location;
						return textKeeper.textConstants.KEEP_QUIET;
					} else {
						if($anchor.length > 1) {
							setContext(false);
							_this.commandHash.speakerText = "There are "+$anchor.length+" choices for the link "+location+". Which one to go with?";
							return textKeeper.textConstants.KEEP_QUIET;
						} else {
							_this.commandHash.speakerText = "Going to link "+$anchor.text();
							window.location.href = $anchor.attr("href");
							return textKeeper.textConstants.KEEP_QUIET;
						}
					}
				} else {
					setContext(true);
					_this.commandHash.speakerText = "Which link?";
					return textKeeper.textConstants.KEEP_QUIET;
				}
			},
			go_to_field: function() {
				var textbox = getNeedle(_this.commandHash.command);
				if(textbox) {
					var $textbox, splitText = textbox.split(" "),
						tempUnderscoreSelector = splitText.join("_"),
						tempHypenSelector = splitText.join("-"),
						tempSelector = splitText.join("");
					if($("[name*='"+textbox+"'").length) {
						$textbox = $("[name*='"+textbox+"'");
					} else if($("[name*='"+tempSelector+"'").length) {
						$textbox = $("[name*='"+tempSelector+"'");
					} else if($("[name*='"+tempHypenSelector+"'").length) {
						$textbox = $("[name*='"+tempHypenSelector+"'");
					} else if($("[name*='"+tempUnderscoreSelector+"'").length) {
						$textbox = $("[name*='"+tempUnderscoreSelector+"'");
					} else if($("label:contains('"+textbox+"')").length) {
						$textbox = $("input[id='"+$("label:contains('"+textbox+"')").attr("id")+"']");
						if(!$textbox.length) {
							$textbox = $("label:contains('"+textbox+"')").find("input")
						}
					} else {
						splitText.forEach(function(item) {
							$textbox = $("[name*='"+item+"'");
							if($textbox.length) {
								return false;
							}
						});
					}
					if($textbox && !$textbox.length) {
						_this.commandHash.speakerText = "Unable to find mathcing field for text "+textbox;
						return textKeeper.textConstants.KEEP_QUIET;
					} else {
						if($textbox.length > 1) {
							_this.commandHash.speakerText = "There are "+$textbox.length+" choices for the field "+textbox+". Which one to go with?";
							return textKeeper.textConstants.KEEP_QUIET;
						} else {
							$textbox.focus();
							_this.commandHash.speakerText = "Focussed on field"+textbox;
							return textKeeper.textConstants.KEEP_QUIET;
						}
					}
				} else {
					setContext();
				}
			},
			go_to_form: function() {
				var formName = getNeedle(_this.commandHash.command);
				if(formName) {
					var $form = $("form[name*='"+formName+"']");
					if(!$form.length) {
						_this.commandHash.speakerText = "No form found with name "+formName;
						return textKeeper.textConstants.KEEP_QUIET;
					} else {
						if($form.length > 1) {
							setContext(false);
							_this.commandHash.speakerText = "There are "+$form.length+" choices for the form name "+formName+". Which one to go with?";
							return textKeeper.textConstants.KEEP_QUIET;
						} else {
							_this.commandHash.speakerText = "Focussing on "+$form.attr("name")+" form's first field";
							$(":tabbable", $form).eq(0).focus();
							return textKeeper.textConstants.KEEP_QUIET;
						}
					}
				} else {
					setContext(true);
					_this.commandHash.speakerText = "Which form?";
					return textKeeper.textConstants.KEEP_QUIET;
				}
			},
			go_to_combobox: function() {
				var selection = getNeedle(_this.commandHash.command);
				if(selection) {
					var $combos = $("select:contains('"+selection+"')");
					if(!$combos.length) {
						_this.commandHash.speakerText = "No combo box found with text "+selection;
						return textKeeper.textConstants.KEEP_QUIET;
					} else {
						if($combos.length > 1) {
							setContext(false);
							_this.commandHash.speakerText = "There are "+$combos.length+" choices for the term "+selection+". Which one to go with?";
							return textKeeper.textConstants.KEEP_QUIET;
						} else {
							_this.commandHash.speakerText = "Focussing combo box "+selection;
							$combos.focus();
							return textKeeper.textConstants.KEEP_QUIET;
						}
					}
				} else {
					setContext(true);
					_this.commandHash.speakerText = "Which combo box?";
					return textKeeper.textConstants.KEEP_QUIET;
				}
			},
			scroll_top: function() {
				$('html, body').animate({scrollTop:0}, 400);
				return textKeeper.textConstants.SCROLL_TOP;
			},
			scroll_up: function() {
				$('html, body').animate({scrollTop:$(document).scrollTop()-100}, 400);
				return textKeeper.textConstants.SCROLL_UP;
			},
			scroll_last: function() {
				$('html, body').animate({scrollTop:$(document).height()}, 400);
				return textKeeper.textConstants.SCROLL_LAST;
			},
			scroll_down: function() {
				$('html, body').animate({scrollTop:$(document).scrollTop()+100}, 400);
				return textKeeper.textConstants.SCROLL_DOWN;
			},
			hi_jarvis: function() {
				return textKeeper.textConstants.HI_JARVIS;
			},
			get_layout: function() {
				var text = "";
				text = "The title of the page is "+$("title").html()+".";
				var divLength = $("body > div").length;
				var formLength = $("body > form").length;
				var sectionLength = $("body > section").length;
				var headerLength = $("body > header").length;
				var footerLength = $("body > footer").length;
				var navLength = $("body > nav").length;
				text += "The site has ";
				if(divLength) {
					text += divLength+" division ";
				}
				if(formLength) {
					text += formLength+" form ";
				}
				if(sectionLength) {
					text += sectionLength+" sections ";
				}
				if(sectionLength) {
					text += headerLength+" header ";
				}
				if(footerLength) {
					text += footerLength+" footer ";	
				}
				if(footerLength) {
					text += navLength+" navigation menu ";	
				}
				_this.commandHash.speakerText = text;
				return textKeeper.textConstants.KEEP_QUIET;
			},
			next: function() {
				var context = contextManager.getContext(), currentElement = context.currentElement;
				var $element = $(":tabbable").eq($(":tabbable").index(currentElement[0]) + 1);
				$element.focus();
				_this.commandHash.speakerText = readElementDescription($element);
				contextManager.setContext(_this.commandHash, $element);
				return textKeeper.textConstants.KEEP_QUIET;
			},
			previous: function() {
				var context = contextManager.getContext(), currentElement = context.currentElement;
				var $element = $(":tabbable").eq($(":tabbable").index(currentElement[0]) - 1);
				$element.focus();
				_this.commandHash.speakerText = readElementDescription($element);
				contextManager.setContext(_this.commandHash, $element);
				return textKeeper.textConstants.KEEP_QUIET;
			},
			clear_that: function() {
				var context = contextManager.getContext(), currentElement = context.currentElement;
				if(currentElement.prop("tagName") == "INPUT" || currentElement.prop("tagName") == "TEXTAREA") {
					if(currentElement.attr("type") == 'checkbox') {
						currentElement.removeAttr('checked');
					} else {
						if(window.getSelection && window.getSelection().toString() != "") {
							currentElement.val(currentElement.value.replace(window.getSelection().toString(),""));
						} else {
							currentElement.val("");
						}
					}
				} else if(currentElement.prop("tagName") == "SELECT") {
					$("option:first", currentElement).attr("selected", "selected");
				}
			}
		};

		function readElementDescription($element) {
			var string = "Focused on ", elementTag = $element.prop('tagName').toLowerCase();
			if(elementTag == "input") {
				string += "field "+$element.attr("type") + $element.attr("name");
			} else if(elementTag == "select") {
				string += "field combo box"+ $element.attr("name");
			} else if(elementTag == "textarea") {
				string += "field text area"+ $element.attr("name");
			} else if(elementTag == "button") {
				string += "field button"+ $element.text();
			}
			return string;
		}

		var getNeedle = function(str) {
			return (str.replace(_this.commandHash.commandObject.command, "") || "").trim();
		};

		var setContext = function(isCommandInComplete) {
			contextManager.setCommandInComplete(isCommandInComplete);
			contextManager.setContext(_this.commandHash);
		};

		var getContext = function() {
			return contextManager.getContext();
		};

		var executeOrphanCommandWithContext = function(command) {
			if(contextManager.isCommandInComplete()) {
				var context = contextManager.getContext();
				context.commandHash.command = context.commandHash.command + command;
				_this.commandController.processCommand(context.commandHash);
			} else {
				contextManager.clearContext();
				
			}
		};

		this.executeCommand = function(commandHash) {
			this.commandHash = commandHash;
			var commandFunction = this.commandActions[this.commandHash.commandObject.id] || this.commandActions["command_invalid"],
				speakerCode = "";
			if(typeof commandFunction == "function") {
				speakerCode = commandFunction();
			}
			this.commandHash.speakerCode = speakerCode;
		}

		var performAnchorAction = function($anchor) {
			$anchor.attr("href") != "return false"//start from here
		}
	}
	return CommandExecutor;
});