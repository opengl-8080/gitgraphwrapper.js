module.exports = function(grunt) {
    grunt.initConfig({
        files: {
            src: 'src/gitgraphwrapper.js',
            test: 'test/gitgraphwrapper-test.js',
            helper: 'test/MockGitGraph.js',
            min: 'build/gitgraphwrapper.min.js'
        },
        watch: {
            files: ['<%= files.src %>', '<%= files.test %>'],
            tasks: ['jasmine']
        },
        jshint: {
            files: ['<%= files.src %>']
        },
        jasmine: {
            build: {
                src: '<%= files.src %>',
                options: {
                    specs: '<%= files.test %>',
                    helpers: '<%= files.helper %>'
                }
            }
        },
        uglify: {
            build: {
                files: {
                    '<%= files.min %>': '<%= files.src %>'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', ['jshint', 'jasmine', 'uglify']);
    grunt.registerTask('test', ['jshint', 'jasmine']);
};
