const gulpUtils = require("./gulp-utils");
const utils = require("./utils");
const fs = require("fs");
const mainDir = "./extensions/modules";
const prefix = "mod_";
const mainBaseTask = "modules";
const mainModuleDirs = ["site", "admin"];
const mainTasks = [];

mainModuleDirs.forEach((mmDir) => {
    const fullDir = mainDir + "/" + mmDir;

    if (!fs.existsSync(fullDir)) {
        return;
    }

    const moduleDirs = utils.getFilesByType(fullDir, "directory");
    const moduleTasks = gulpUtils.generateDirTasks(
        fullDir,
        mainBaseTask + ":" + mmDir
    );

    moduleDirs.forEach(function (dir) {
        const moduleDir = fullDir + "/" + dir;
        const moduleBaseTask = mainBaseTask + ":" + mmDir + ":" + dir;
        gulpUtils.generateContentTasks(
            moduleDir,
            [],
            dir,
            moduleBaseTask,
            "modules/" + mmDir + "/" + dir,
            mainBaseTask + "/" + mmDir,
            prefix + dir
        );
    });
    gulpUtils.createGulpTasks(
        mainBaseTask + ":" + mmDir,
        moduleTasks.tasks,
        false
    );
    mainTasks.push(mainBaseTask + ":" + mmDir);
});

const tasks = gulpUtils.getBaseTasks();

mainTasks.forEach((mainTask) => {
    Object.keys(tasks).forEach((task) => {
        tasks[task].push(task + ":" + mainTask);
    });
});

gulpUtils.createGulpTasks(mainBaseTask, tasks, false);
