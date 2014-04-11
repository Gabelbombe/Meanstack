'use strict';

module.exports = function(grunt) {

    var path    = require('path'),
        process = require('process');

    require('load-grunt-config')(grunt, {
        configPath: path.join(process.cwd(), 'grunt'), //path to task.js files, defaults to grunt dir
        init: true, //auto grunt.initConfig
        data: { //data passed into config.  Can use with <%= test %>
            test: false
        },
        loadGruntTasks: { //can optionally pass options to load-grunt-tasks.  If you set to false, it will disable auto loading tasks.
            pattern: 'grunt-*',
            config:  require('./package.json'),
            scope:   'devDependencies'
        }
    });

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