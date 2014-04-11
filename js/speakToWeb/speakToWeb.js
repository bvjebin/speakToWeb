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
    var uuid = Math.floor(Math.random.apply([1, 999]) * 1000);
    var recognition, commandController;
    var options = { //external options
        keys: ["ctrlKey", 90],
        key: "control z",
        language: "en-IN",
        showPanel: true,
        panelContainer: "#results" + uuid,
    };
    speakToWeb.init = function(initOptions) {
        var _this = this;
        options = $.extend(true, options, initOptions);
        createRequiredDom();
        jQuery.expr[":"].contains = jQuery.expr.createPseudo(function(arg) {
            return function(elem) {
                return jQuery(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
            };
        });
        require(
            ["speak/speaker", "recognition/recognition", "command/commandController", "utils/utils", ], function(Speaker, Recognition, CommandController) {
                speakToWeb.speaker = Speaker; //Speech library wrapper
                recognition = new Recognition(options);
                recognition.init();
                commandController = new CommandController(options);
                _this.giveCommand = function(str) {
                    var processedCommandHash = commandController.processCommand({
                        command: str
                    });
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
                    var processedCommandHash = commandController.processCommand({
                        command: e.detail.command
                    });
                    speakToWeb.speaker(processedCommandHash.speakerText);
                }, false);
            });
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
    return speakToWeb;
})();
$(document).ready(function($) {
    speakToWeb.init();
});