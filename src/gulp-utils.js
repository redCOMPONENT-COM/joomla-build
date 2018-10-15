const utils = require("./utils.js");
const gulp = require("gulp");
const zip = require("gulp-zip");
const prune = require("gulp-prune");
const newer = require("gulp-newer");
const del = require("del");
const fileExists = require("file-exists");
const composer = require("gulp-composer");

/**
 * Main configuration
 *
 * @type {{defaultTasks: string[], releaseDir: string, wwwDir: string, watchInterval: number, useVersions: boolean}}
 */
const config = {
    "defaultTasks": ["release"],
    "releaseDir": "./releases",
    "wwwDir": "/.tmp/www",
    "watchInterval": 500,
    "useVersions": true
};

/**
 * Base tasks for every directory (to be cloned using getBaseTasks)
 *
 * @type {{release: Array, clean: Array, copy: Array, watch: Array}}
 */
const baseDirSt = {
    "release": [],
    "clean": [],
    "copy": [],
    "watch": []
};

/**
 * Sets the configuration from a data object, overwriting it where possible
 *
 * @param data
 */
function setConfigurationFromData(data) {
    "use strict";
    if (data.hasOwnProperty("defaultTasks")) {
        config.defaultTasks = data.defaultTasks;
    }
    if (data.hasOwnProperty("releaseDir")) {
        config.releaseDir = data.releaseDir;
    }
    if (data.hasOwnProperty("wwwDir")) {
        config.wwwDir = data.wwwDir;
    }
    if (data.hasOwnProperty("watchInterval")) {
        config.watchInterval = data.watchInterval;
    }
    if (data.hasOwnProperty("useVersions")) {
        config.useVersions = data.useVersions;
    }
}

/**
 * Clones the base task set
 *
 * @returns {Object}
 */
function getBaseTasks() {
    "use strict";
    return utils.cloneObject(baseDirSt);
}

/**
 * Clones only the web tasks
 *
 * @returns {Object}
 */
function getBaseWebTasks() {
    "use strict";
    const webTasks = utils.cloneObject(baseDirSt);
    delete webTasks.release;
    return webTasks;
}

/**
 * Generates a full task set based on the baseDirSt object and the baseTask given
 *
 * @param {string}  baseTask
 * @param {Object}  taskSet               Optional to populate an existing variable
 * @param {boolean} generateReleaseTasks  Generate release tasks or not
 * @param {boolean} generateWebTasks      Generate web tasks or not
 *
 * @returns {Array}
 */
function generateTaskSet(baseTask, taskSet, generateReleaseTasks, generateWebTasks) {
    "use strict";
    const tasks =
            (taskSet === null
        ? getBaseTasks()
        : null);
    let destination =
            (taskSet === null
        ? tasks
        : taskSet);

    if (generateReleaseTasks) {
        destination.release.push("release:" + baseTask);
    } else {
        delete destination.release;
    }
    if (generateWebTasks) {
        destination.clean.push("clean:" + baseTask);
        destination.copy.push("copy:" + baseTask);
        destination.watch.push("watch:" + baseTask);
    } else {
        delete destination.clean;
        delete destination.copy;
        delete destination.watch;
    }
    return destination;
}

/**
 * Creates the gulp tasks given a base task and its dependencies, both following the base task structure
 *
 * @param {string}          baseTask
 * @param {Object}          dependencies
 * @param {Object|boolean}  tasks         Object with tasks to generate.  If false it generates the default set
 */
function createGulpTasks(baseTask, dependencies, tasks) {
    "use strict";
    if (tasks === false || tasks.hasOwnProperty("release")) {
        gulp.task("release:" + baseTask, gulp.parallel(dependencies.release));
    }
    if (tasks === false || tasks.hasOwnProperty("clean")) {
        gulp.task("clean:" + baseTask, gulp.parallel(dependencies.clean));
    }
    if (tasks === false || tasks.hasOwnProperty("copy")) {
        gulp.task("copy:" + baseTask, gulp.parallel(dependencies.copy));
    }
    if (tasks === false || tasks.hasOwnProperty("watch")) {
        gulp.task("watch:" + baseTask, gulp.parallel(dependencies.watch));
    }
}

/**
 * Generates generic tasks for a given directory and returns them with their directories
 *
 * @param {string} mainDir    Main directory where tasks reside (subfolders are getting their own tasks)
 * @param {string} baseTask   Base task of the main directory (to be created with dependency on the sub directory tasks)
 *
 * @returns {Object}  Collection of tasks and collection of directories, each with its own tasks
 */
function generateDirTasks(mainDir, baseTask) {
    "use strict";
    const mainTasks = getBaseTasks();
    const directories = [];
    utils.getFilesByType(mainDir, "directory").forEach(function (dir) {
        const dirTasks = generateTaskSet(baseTask + ":" + dir, null, true, true);
        generateTaskSet(baseTask + ":" + dir, mainTasks, true, true);
        directories.push({"directory": dir, tasks: dirTasks});
    });
    return {"tasks": mainTasks, "directories": directories};
}

/**
 * Generates and creates the actual gulp tasks for a given directory, considering it an actual extension
 *
 * @param {string} dir                    Directory where content tasks are to be generated
 * @param {Array}  extraSources           Other source directories to include
 * @param {string} extensionName          Extension name
 * @param {string} baseTask               Base task name of this directory
 * @param {string} destinationWebDir      Directory where this package belongs in the website
 * @param {string} destinationReleaseDir  Directory where the release package will be moved to
 * @param {string} zipName                Zip name to provide to the release package
 *
 * @returns {Object}  Generated tasks dependent of the main task
 */
function generateContentTasks(dir, extraSources, extensionName, baseTask, destinationWebDir, destinationReleaseDir, zipName) {
    "use strict";
    // Checks which tasks must be generated.  If dirs are omitted, tasks are too
    const executeWebTasks = destinationWebDir !== "";
    const executeReleaseTasks = destinationReleaseDir !== "";

    // Get out of here if no directories are provided
    if (!executeWebTasks && !executeReleaseTasks) {
        return {};
    }

    const releaseTasks = ["release-do:" + baseTask];
    const copyTasks = ["copy-do:" + baseTask];
    const watchTasks = ["watch-main:" + baseTask];
    const composerExists = fileExists.sync(dir + "/composer.json");
    const sources = [dir + "/**"].concat(extraSources);

    if (composerExists) {
        gulp.task("composer:" + baseTask, function () {
            return composer({"working-dir": dir});
        });
        releaseTasks.unshift("composer:" + baseTask);
        copyTasks.unshift("composer:" + baseTask);
        watchTasks.unshift("watch-composer:" + baseTask);
    }

    if (executeReleaseTasks) {
        // Release tasks
        const releaseFunction = function () {
            const versionNumber =
                    config.useVersions === true
                ? utils.getManifestVersion(dir + "/" + extensionName + ".xml")
                : "";
            const versionName = (
                versionNumber !== ""
                    ? "-v" + versionNumber
                    : ""
            );
            return gulp.src(sources)
                .pipe(zip(zipName + versionName + ".zip"))
                .pipe(gulp.dest(config.releaseDir + "/" + destinationReleaseDir));

        };
        if (composerExists) {
            gulp.task("release-do:" + baseTask, releaseFunction);
            gulp.task("release:" + baseTask, gulp.parallel(releaseTasks));
        } else {
            gulp.task("release:" + baseTask, releaseFunction);
        }
    }

    if (executeWebTasks) {
        // Clean task
        gulp.task("clean:" + baseTask, function () {
            return del(config.wwwDir + "/" + destinationWebDir, {force: true});
        });

        // Copy tasks
        const copyFunction = function () {
            return gulp.src(sources)
                .pipe(prune({
                    dest: config.wwwDir + "/" + destinationWebDir
                }))
                .pipe(newer({
                    dest: config.wwwDir + "/" + destinationWebDir
                }))
                .pipe(gulp.dest(config.wwwDir + "/" + destinationWebDir));
        };
        const copyFunctionName =
                composerExists
            ? "copy-do"
            : "copy";

        if (composerExists) {
            gulp.task("copy-do:" + baseTask, copyFunction);
            gulp.task("copy:" + baseTask, gulp.parallel(copyTasks));
        } else {
            gulp.task("copy:" + baseTask, copyFunction);
        }

        // Watch tasks
        const watchFunction = function () {
            return gulp.watch(sources,
                    {interval: config.watchInterval},
                    gulp.series(copyFunctionName + ":" + baseTask));
        };

        if (composerExists) {
            gulp.task("watch-composer:" + baseTask, function () {
                return gulp.watch(
                    [dir + "/composer.json", dir + "/composer.lock"],
                    {interval: config.watchInterval},
                    gulp.series("composer:" + baseTask)
                );
            });
            gulp.task("watch-main:" + baseTask, watchFunction);
            gulp.task("watch:" + baseTask, gulp.parallel(watchTasks));
        } else {
            gulp.task("watch:" + baseTask, watchFunction);
        }
    }

    return generateTaskSet(baseTask, null, executeReleaseTasks, executeWebTasks);
}

exports.config = config;
exports.baseDirSt = baseDirSt;
exports.setConfigurationFromData = setConfigurationFromData;
exports.getBaseTasks = getBaseTasks;
exports.getBaseWebTasks = getBaseWebTasks;
exports.generateDirTasks = generateDirTasks;
exports.generateContentTasks = generateContentTasks;
exports.createGulpTasks = createGulpTasks;