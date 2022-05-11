const fs = require("fs");
const xml2js = require("xml2js");
const xmlParser = new xml2js.Parser();

/**
 * Reads a JSON file and returns the parsed JSON data
 *
 * @param {string}  jsonFile   Path to the json file
 *
 * @returns {string}  Empty json object if file does not exist
 */
function readJSON(jsonFile) {
    if (!fs.existsSync(jsonFile)) {
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
    const files = fs.readdirSync(dir);
    const dirs = [];
    files.forEach(function (file) {
        const isDirectory = fs.statSync(dir + "/" + file).isDirectory();
        if (
            (type === "directory" && isDirectory) ||
            (type !== "directory" && !isDirectory)
        ) {
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
