const gulpUtils = require("./gulp-utils.js");
const utils = require("./utils.js");
const mainDir = "./extensions/components";
const prefix = "com_";
const mainBaseTask = "components";

const componentDirs = utils.getFilesByType(mainDir, "directory");
const componentTasks = gulpUtils.generateDirTasks(mainDir, mainBaseTask);

componentDirs.forEach(function (component) {
    "use strict";
    const componentDir = mainDir + "/" + component;
    const componentBaseTask = mainBaseTask + ":" + component;
    const componentExtensionName =
            component.substr(0, 4) === prefix
        ? component.substr(4)
        : prefix + component;

    // Release tasks
    gulpUtils.generateContentTasks(
        componentDir,
        [],
        componentExtensionName,
        componentBaseTask,
        "",
        mainBaseTask,
        component
    );

    const componentStandaloneFiles = [];
    utils.getFilesByType(componentDir, "file").forEach(function (file) {
        componentStandaloneFiles.push(componentDir + "/" + file);
    });

    // Copy tasks (inherits to admin/site directories).  Reserved directory names: "admin" for backend, and any other for the frontend
    const componentDirTasks = gulpUtils.generateDirTasks(componentDir, componentBaseTask);
    componentDirTasks.directories.forEach(function (componentSite) {
        const componentSiteDir = mainDir + "/" + component + "/" + componentSite.directory;
        const componentSiteBaseTask = mainBaseTask + ":" + component + ":" + componentSite.directory;
        const componentSiteWebDir = (componentSite.directory === "admin")
            ? "administrator/components/" + prefix + component
            : "components/" + prefix + component;
        gulpUtils.generateContentTasks(
            componentSiteDir,
            (
                componentSite.directory === "admin"
                    ? componentStandaloneFiles
                    : []
            ),
            componentExtensionName,
            componentSiteBaseTask,
            componentSiteWebDir,
            "",
            ""
        );
    });
    gulpUtils.createGulpTasks(componentBaseTask, componentDirTasks.tasks, gulpUtils.getBaseWebTasks());
});
gulpUtils.createGulpTasks(mainBaseTask, componentTasks.tasks, false);