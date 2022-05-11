const gulpUtils = require("./gulp-utils");
const utils = require("./utils");
const mainDir = "./extensions/libraries";
const prefix = "lib_";
const mainBaseTask = "libraries";

const libraryDirs = utils.getFilesByType(mainDir, "directory");
const libraryTasks = gulpUtils.generateDirTasks(mainDir, mainBaseTask);

libraryDirs.forEach(function (dir) {
    const libraryDir = mainDir + "/" + dir;
    const libraryBaseTask = mainBaseTask + ":" + dir;
    gulpUtils.generateContentTasks(
        libraryDir,
        [],
        dir,
        libraryBaseTask,
        "libraries/" + dir,
        mainBaseTask,
        prefix + dir
    );
});
gulpUtils.createGulpTasks(mainBaseTask, libraryTasks.tasks, false);
