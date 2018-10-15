const gulpUtils = require("./gulp-utils");
const mainDir = "./extensions/plugins";
const prefix = "plg_";
const mainBaseTask = "plugins";

const pluginDirTasks = gulpUtils.generateDirTasks(mainDir, mainBaseTask);

pluginDirTasks.directories.forEach(function (pluginType) {
    "use strict";
    const pluginTypeDir = mainDir + "/" + pluginType.directory;
    const pluginTypeBaseTask = mainBaseTask + ":" + pluginType.directory;
    const pluginTypeTasks = gulpUtils.generateDirTasks(pluginTypeDir, pluginTypeBaseTask);
    pluginTypeTasks.directories.forEach(function (plugin) {
        const pluginDir = mainDir + "/" + pluginType.directory + "/" + plugin.directory;
        const pluginBaseTask = mainBaseTask + ":" + pluginType.directory + ":" + plugin.directory;
        gulpUtils.generateContentTasks(
            pluginDir,
            [],
            plugin.directory,
            pluginBaseTask,
            "plugins/" + pluginType.directory + "/" + plugin.directory,
            mainBaseTask,
            prefix + pluginType.directory + "_" + plugin.directory
        );
    });
    gulpUtils.createGulpTasks(pluginTypeBaseTask, pluginTypeTasks.tasks, false);
});
gulpUtils.createGulpTasks(mainBaseTask, pluginDirTasks.tasks, false);