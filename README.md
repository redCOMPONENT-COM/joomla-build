# Gulp-based build/release system for Joomla! extensions

## Intro

This is an npm plugin to deploy your Joomla! extension directly to a website or to create zip packages.

## How it works

This is a gulp-based system that detects the structure (given a base) and automates actions to:

* Copy the extension files to the website
* Clean the website
* Detect active changes on your extension repo and copy to your website on save
* Create release zip packages of your extension(s)

## Supported extensions

Currently, the build system supports a multi-structure organization in the repository, containing:

* Components (with backend and frontend)
* Libraries
* Plugins

Also, extensions can contain a `composer.json` file that will be executed to get a `vendor` file when the extension is released either to the site or to a package

## How to organize your extension

This system requires a certain extension structure (in the root folder of your repository) to work correctly:

```
.
+-- extensions
|   +-- components
|   |   +-- com_extension_1
|   |   |   +-- extension_1.xml
|   |   |   +-- admin
|   |   |   |   +-- extension_1.php
...
|   |   |   +-- site
|   |   |   |   +-- extension_1.php
...
|   |   +-- com_extension_n
...
|   +-- libraries
|   |   +-- library_1
|   |   |   +-- library_1.xml
...
|   |   +-- library_n
...
|   +-- plugins
|   |   +-- plugin_group_1
|   |   |   +-- plugin_1
|   |   |   |   +-- plugin_1.xml
...
|   |   |   +-- plugin_n
...
|   |   +-- plugin_group_n
...
+-- gulpfile.js
+-- gulp-config.json
+-- package.json
```

## Supported gulp commands

* **gulp release**
	* Creates a package out of each Joomla extension, and places it in the *releaseDir* parameter of the configuration
* **gulp copy**
	* Deploys the extensions to a website, with its root folder in the *wwwDir* parameter of the configuration
* **gulp clean**
	* Cleans up the configured website deleting any of the configured extensions in the repository
* **gulp watch**
	* Sets up a monitor process that will check for changes on each of the extensions, so that when a change is produced, that specific extension file will be updated in the configured website 

## Available configuration options

The configuration options can be provided in a `gulp-config.json` file (recommended to be gitignored), or they can be sent via parameters in the command line when the gulp tasks are executed.

* **wwwDir**
	* Configured website to be affected with the *copy*, *clean* and *watch* gulp
* **releaseDir**
	* Folder where the zip packages will be released when performing the *release* task
* **watchInterval**
	* Interval in ms in which the files affected by the *watch* task will be monitored for changes
* **defaultTasks**
	* Array of tasks to be performed when the *gulp* command is executed without a specific task
* **useVersions**
	* Appends the versions of each extension to the zip package name of each extension to be released with the *release* task

To send a configuration option via command line they need to be sent with the format in this example: `gulp release --useVersions=false`

## Requirements
* nodejs 10.0.0
* npm 6.0.0
* gulp 4.0.0

## Inspiration

This package is inspired in the npm plugin `joomla-gulp` regarding the logic of the configuration options and base gulp tasks.

## Changelog

* v.0.1.0
	* Initial version with basic support for components, libraries and plugins

