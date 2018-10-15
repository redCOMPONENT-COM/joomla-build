const fs = require("fs");
const xml2js = require("xml2js");
const fileExists = require("file-exists");
const xmlParser = new xml2js.Parser();

/**
 * Reads a JSON file and returns the parsed JSON data
 *
 * @param {string}  jsonFile   Path to the json file
 *
 * @returns {string}  Empty json object if file does not exist
 */
function readJSON(jsonFile) {
    "use strict";
    if (!fileExists.sync(jsonFile)) {
        return "{}";
    }
    return JSON.parse(fs.readFileSync(jsonFile).toString());
}

/**
 * Clones an object
 *
 * @param object
 *
 * @returns object
 */
function cloneObject(object) {
    "use strict";
    return JSON.parse(JSON.stringify(object));
}

/**
 * Get a list of files over a parent directory
 *
 * @param {string}  dir   Parent directory
 * @param {string}  type  Type of files: "directories" or "files"
 *
 * @returns {Array}
 */
function getFilesbyType(dir, type) {
    "use strict";
    const files = fs.readdirSync(dir);
    const dirs = [];
    files.forEach(function (file) {
        const isDirectory = fs.statSync(dir + "/" + file).isDirectory();
        if ((type === "directory" && isDirectory) || (type !== "directory" && !isDirectory)) {
            dirs.push(file);
        }
    });
    return dirs;
}

/**
 * Gets the version of a Joomla xml manifest file
 *
 * @param {string}  xmlFile  Input XML manifest file (Joomla format)
 *
 * @returns {string}
 */
function getManifestVersion(xmlFile) {
    "use strict";
    let version = "";
    xmlParser.parseString(fs.readFileSync(xmlFile), function (err, data) {
        if (err) {
            return "";
        }
        version = data.extension.version;
        return version;
    });
    return version;
}


exports.readJSON = readJSON;
exports.cloneObject = cloneObject;
exports.getFilesByType = getFilesbyType;
exports.getManifestVersion = getManifestVersion;