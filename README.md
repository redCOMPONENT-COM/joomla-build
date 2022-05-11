# Gulp-based build/release system for Joomla! extensions

[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/redCOMPONENT-COM/joomla-build/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/redCOMPONENT-COM/joomla-build/?branch=master)
[![Build Status](https://scrutinizer-ci.com/g/redCOMPONENT-COM/joomla-build/badges/build.png?b=master)](https://scrutinizer-ci.com/g/redCOMPONENT-COM/joomla-build/build-status/master)

## Intro

This is an npm plugin to deploy your Joomla! extension directly to a website or to create zip packages.

## How it works

This is a gulp-based system that detects the structure (given a base) and automates actions to:

-   Copy the extension files to the website
-   Clean the website
-   Detect active changes on your extension repo and copy to your website on save
-   Create release zip packages of your extension(s)

## Supported extensions

Currently, the build system supports a multi-structure organization in the repository, containing:

-   Components (with backoffice and frontoffice)
-   Libraries
-   Modules (frontoffice and backoffice)
-   Plugins

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
|   +-- modules
|   |   +-- site
|   |   |   +-- site_module_1
|   |   |   |   +-- site_module_1.xml
...
|   |   |   +-- site_module_n
...
|   |   +-- admin
|   |   |   +-- admin_module_1
|   |   |   |   +-- admin_module_1.xml
...
|   |   |   +-- admin_module_n
...
+-- gulpfile.js
+-- gulp-config.json
+-- package.json
```

## Supported gulp commands

-   **gulp release**
    -   Creates a package out of each Joomla extension, and places it in the _releaseDir_ parameter of the configuration
-   **gulp copy**
    -   Deploys the extensions to a website, with its root folder in the _wwwDir_ parameter of the configuration
-   **gulp clean**
    -   Cleans up the configured website deleting any of the configured extensions in the repository
-   **gulp watch**
    -   Sets up a monitor process that will check for changes on each of the extensions, so that when a change is produced, that specific extension file will be updated in the configured website

## Available configuration options

The configuration options can be provided in a `gulp-config.json` file (recommended to be gitignored), or they can be sent via parameters in the command line when the gulp tasks are executed.

-   **wwwDir**
    -   Configured website to be affected with the _copy_, _clean_ and _watch_ gulp
-   **releaseDir**
    -   Folder where the zip packages will be released when performing the _release_ task
-   **watchInterval**
    -   Interval in ms in which the files affected by the _watch_ task will be monitored for changes
-   **defaultTasks**
    -   Array of tasks to be performed when the _gulp_ command is executed without a specific task
-   **useVersions**
    -   Appends the versions of each extension to the zip package name of each extension to be released with the _release_ task

To send a configuration option via command line they need to be sent with the format in this example: `gulp release --useVersions=false`

## Requirements

-   nodejs 10.0.0
-   npm 6.0.0
-   gulp 4.0.0

## Inspiration

This package is inspired in the npm plugin `joomla-gulp` regarding the logic of the configuration options and base gulp tasks.

## Changelog

-   v.0.1.0
    -   Initial version with basic support for components, libraries and plugins
