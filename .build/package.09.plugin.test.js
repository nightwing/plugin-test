define("plugins/09.plugin.test/package.09.plugin.test", [], {
    "name": "09.plugin.test",
    "description": "",
    "version": "0.0.1",
    "author": "",
    "contributors": [
        {
            "name": "",
            "email": ""
        }
    ],
    "repository": {
        "type": "git",
        "url": ""
    },
    "categories": [
        "miscellaneous"
    ],
    "licenses": [],
    "c9": {
        "plugins": [
            {
                "packagePath": "plugins/09.plugin.test/main"
            },
            {
                "packagePath": "plugins/09.plugin.test/second"
            },
            {
                "packagePath": "plugins/09.plugin.test/__static__"
            }
        ]
    }
});

define("plugins/09.plugin.test/second",[], function(require, exports, module) {
    main.consumes = [
        "Plugin", "plugin09"
    ];
    main.provides = ["second"];
    return main;

    function main(options, imports, register) {
        var Plugin = imports.Plugin;
        var plugin09 = imports.plugin09;
        
        var plugin = new Plugin("Ajax.org", main.consumes);
        var emit = plugin.getEmitter();
        
        function load() {
            console.log(plugin09);
            emit("ready");
        }
        
        plugin.on("load", function() {
            load();
        });
        plugin.on("unload", function() {
        });
        plugin.freezePublicAPI({
        });
        
        register(null, {
            "second": plugin
        });
    }
});

define("text!plugins/09.plugin.test/plugin.html",[],"<div class=\"helloworld\">Hello World</div>");

define("text!plugins/09.plugin.test/style.css",[],".helloworld{\n    padding: 10px;\n    background: red;\n    position: absolute;\n    left: 10px;\n    top: 10px;\n    z-index: 100000;\n    width: 640px;\n    height: 400px;\n    background: url(\"@{image-path}/puppy.jpg\");\n    box-sizing: border-box;\n    color: white;\n}");

define("plugins/09.plugin.test/main",[], function(require, exports, module) {
    main.consumes = [
        "Plugin", "ui", "commands", "menus", "preferences", "settings"
    ];
    main.provides = ["plugin09"];
    return main;

    function main(options, imports, register) {
        var Plugin = imports.Plugin;
        var ui = imports.ui;
        var menus = imports.menus;
        var commands = imports.commands;
        var settings = imports.settings;
        var prefs = imports.preferences;
        
        var plugin = new Plugin("Ajax.org", main.consumes);
        var emit = plugin.getEmitter();
        
        var showing;
        function load() {
            commands.addCommand({
                name: "mycommand",
                bindKey: { mac: "Command-I", win: "Ctrl-I" },
                isAvailable: function(){ return true; },
                exec: function() {
                    showing ? hide() : show();
                }
            }, plugin);
            
            menus.addItemByPath("Tools/My Menu Item", new ui.item({
                command: "mycommand"
            }), 300, plugin);
            
            settings.on("read", function(e){
                settings.setDefaults("user/my-plugin", [
                    ["first", "1"],
                    ["second", "all"]
                ]);
            });
            
            prefs.add({
                "Example" : {
                    position: 450,
                    "My Plugin" : {
                        position: 100,
                        "First Setting": {
                            type: "checkbox",
                            setting: "user/my-plugin/@first",
                            position: 100
                        },
                        "Second Setting": {
                            type: "dropdown",
                            setting: "user/my-plugin/@second",
                            width: "185",
                            position: 200,
                            items: [
                                { value: "you", caption: "You" },
                                { value: "me", caption: "Me" },
                                { value: "all", caption: "All" }
                            ]
                        }
                    }
                }
            }, plugin);
        }
        
        var drawn = false;
        function draw() {
            if (drawn) return;
            drawn = true;
            var markup = require("text!./plugin.html");
            ui.insertHtml(document.body, markup, plugin);
            ui.insertCss(require("text!./style.css"), options.staticPrefix, plugin);
        
            emit("draw");
        }
        
        function show() {
            draw();
            
            var div = document.querySelector(".helloworld");
            div.style.display = "block";
            div.innerHTML = settings.get("user/my-plugin/@second");
            
            emit("show");
            showing = true;
        }
        
        function hide() {
            if (!drawn) return;
            
            document.querySelector(".helloworld").style.display = "none";
            
            emit("hide");
            showing = false;
        }
        
        plugin.on("load", function() {
            load();
        });
        plugin.on("unload", function() {
            drawn = false;
            showing = false;
        });
        plugin.freezePublicAPI({
            get showing(){ return showing; },
            
            _events: [
                "show",
                "hide"
            ],
            show: show,
            hide: hide,
        });
        
        register(null, {
            "plugin09": plugin
        });
    }
});

define("plugins/09.plugin.test/__static__",[], function(require, exports, module) {
    main.consumes = [
        "Plugin", "plugin.debug"
    ];
    main.provides = [];
    return main;
    function main(options, imports, register) {
        var debug = imports["plugin.debug"];
        var Plugin = imports.Plugin;
        var plugin = new Plugin();
        plugin.version = "0.0.1";
        plugin.on("load", function load() {
            [
                {
                    "type": "modes",
                    "filename": "red.js",
                    "data": "caption: Red; extensions: .red, .green"
                }
            ].forEach(function(x) {
                debug.addStaticPlugin(x.type, "09.plugin.test", x.filename, x.data, plugin);
            });
        });
        
        plugin.load("09.plugin.test.bundle");
        
        register(null, {});
    }
});
