module.exports = {
    serverViews: {
        files: [
            'app/views/**'
        ],
        options: {
            livereload: true
        }
    },
    serverJS: {
        files: [
            'Gruntfile.js',
            'server.js',
            'config/**/*.js',
            'app/**/*.js'
        ],
        tasks: [
            'jshint'
        ],
        options: {
            livereload: true
        }
    },
    clientViews: {
        files: [
            'public/modules/**/views/*.html'
        ],
        options: {
            livereload: true
        }
    },
    clientJS: {
        files: [
            'public/js/**/*.js', 'public/modules/**/*.js'
        ],
        tasks: [
            'jshint'
        ],
        options: {
            livereload: true
        }
    },
    clientCSS: {
        files: [
            'public/**/css/*.css'
        ],
        options: {
            livereload: true
        }
    }
};