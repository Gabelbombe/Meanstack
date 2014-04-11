'use strict';

module.exports = function(grunt) {

    var process = require('process'),
        path    = require('path');

    require('load-grunt-config')(grunt, {
        configPath: path.join(process.cwd(), 'grunt'), // path to task.js files, defaults to grunt dir
        init: true, // auto grunt.initConfig
        data: {     // data passed into config.  Can use with <%= test %>
            test: false
        },
        loadGruntTasks: { // can optionally pass options to load-grunt-tasks.  If you set to false, it will disable auto loading tasks.
            pattern: 'grunt-*',
            config:  require('./package.json'),
            scope:   'devDependencies'
        }
    });

    /**
     * Task registration still outside of autoloader
     * TODO: [Load Externally defined tasks] (http://gruntjs.com/api/grunt#loading-externally-defined-tasks)
     */

    // making grunt default to force in order not to break the project.
    grunt.option('force', true);

    // test task.
    grunt.registerTask('test', [
        'env:test',
        'mochaTest',
        'karma:unit'
    ]);

    // default task(s).
    grunt.registerTask('default', [
        'jshint',
        'concurrent'
    ]);
};