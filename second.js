define(function(require, exports, module) {
    main.consumes = [
        "Plugin", "plugin09"
    ];
    main.provides = ["second"];
    return main;

    function main(options, imports, register) {
        var Plugin = imports.Plugin;
        var plugin09 = imports.plugin09;
        
        /***** Initialization *****/
        
        var plugin = new Plugin("Ajax.org", main.consumes);
        var emit = plugin.getEmitter();
        
        function load() {
            console.log(plugin09);
            emit("ready");
        }
        
        
        /***** Methods *****/
        
        
        /***** Lifecycle *****/
        
        plugin.on("load", function() {
            load();
        });
        plugin.on("unload", function() {
        });
        
        /***** Register and define API *****/
        
        /**
         * This is an example of an implementation of a plugin.
         * @singleton
         */
        plugin.freezePublicAPI({
        });
        
        register(null, {
            "second": plugin
        });
    }
});