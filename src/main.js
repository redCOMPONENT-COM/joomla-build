const gulpUtils = require("./gulp-utils.js");
const utils = require("./utils.js");
const gulp = require("gulp");
const yargs = require("yargs");

const extensionTypes = [
    "components",
    "libraries",
    "plugins"
];

extensionTypes.forEach(function (type) {
    "use strict";
    require("./" + type + ".js");
});

const mainTasks = gulpUtils.getBaseTasks();

// Configuration read task.  Stores it in gulpUtils.config variable
gulp.task("config", function (done) {
    "use strict";
    gulpUtils.setConfigurationFromData(utils.readJSON("../../gulp-config.json"));
    gulpUtils.setConfigurationFromData(yargs.argv);
    done();
});

extensionTypes.forEach(function (type) {
    "use strict";
    mainTasks.release.push("release:" + type);
    mainTasks.clean.push("clean:" + type);
    mainTasks.copy.push("copy:" + type);
    mainTasks.watch.push("watch:" + type);
});

gulp.task("release", gulp.series("config", gulp.parallel(mainTasks.release)));
gulp.task("clean", gulp.series("config", gulp.parallel(mainTasks.clean)));
gulp.task("copy", gulp.series("config", gulp.parallel(mainTasks.copy)));
gulp.task("watch", gulp.series("config", gulp.parallel(mainTasks.watch)));
gulp.task("default", gulp.parallel(gulpUtils.config.defaultTasks));