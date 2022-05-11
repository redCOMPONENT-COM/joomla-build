const gulpUtils = require("./gulp/gulp-utils.js");
const utils = require("./gulp/utils.js");
const yargs = require("yargs");
const fs = require("fs");
const { task, series, parallel } = require("gulp");
const gulp = require("gulp");

const allExtensionTypes = ["components", "libraries", "plugins"];
const extensionTypes = [];

allExtensionTypes.forEach(function (type) {
    if (fs.existsSync("./extensions/" + type)) {
        require("./gulp/" + type + ".js");
        extensionTypes.push(type);
    }
});

const mainTasks = gulpUtils.getBaseTasks();

// Configuration read task.  Stores it in gulpUtils.config variable
const config = function (done) {
    gulpUtils.setConfigurationFromData(utils.readJSON("gulp-config.json"));
    gulpUtils.setConfigurationFromData(yargs.argv);
    done();
};

extensionTypes.forEach(function (type) {
    mainTasks.release.push("release:" + type);
    mainTasks.clean.push("clean:" + type);
    mainTasks.copy.push("copy:" + type);
    mainTasks.watch.push("watch:" + type);
});

exports.release = series(config, parallel(mainTasks.release));
exports.clean = series(config, parallel(mainTasks.clean));
exports.copy = series(config, parallel(mainTasks.copy));
exports.watch = series(config, parallel(mainTasks.watch));
exports.default = parallel(exports[gulpUtils.config.defaultTasks]);
