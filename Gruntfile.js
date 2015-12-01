module.exports = function (grunt) {
    // Load grunt tasks
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    
    // Set root directory to build/ 
    var rootDir = '.';
    
    // Library dependencies
    var devDependencies = {
        js: [
            './bower_components/jquery/dist/jquery.js'
        ],
        css: [
            './bower_components/font-awesome/css/font-awesome.css'
        ],
        fonts: [
            './bower_components/font-awesome/*.*'
        ]
    };
    
    // Library components to put together
    var mainComponents = {
        js: [
            './src/js/inputs.js'
        ],
        css: [
            './src/css/inputs.css'
        ]
    };
    
    // The assembled files to move to dist
    var assembledComponents = [
        './prod/jigl.js',
        './prod/jigl.min.js',
        './prod/jigl.min.js.map',
        './prod/jigl.css',
        './prod/jigl.min.css',
        './prod/jigl.min.css.map',
    ];
    
    // Define new tasks
    grunt.initConfig({
        concat: {
            jsComponents: {
                src: mainComponents.js,
                dest: './prod/jigl.js'
            },
            cssComponents: {
                src: mainComponents.css,
                dest: './prod/jigl.css'
            }
        },
        uglify: {
            options: {
                sourceMap: false,
                mangleProperties: false
            },
            target: {
                files: {
                    './prod/jigl.min.js': ['./prod/jigl.js']
                }
            }
        },
        cssmin: {
            options: {
                sourceMap: false,
                keepSpecialComments: 0
            },
            target: {
                files: {
                    './prod/jigl.min.css': ['./prod/jigl.css']
                }
            }
        },
        copy: {
            dev: {
                files: [{
                    cwd: rootDir,
                    src: devDependencies.js,
                    dest: './src/js/vendor/',
                    flatten: true,
                    expand: true
                }, {
                    cwd: rootDir,
                    src: devDependencies.css,
                    dest: './src/css/vendor/',
                    flatten: true,
                    expand: true
                }, {
                    cwd: rootDir,
                    src: devDependencies.fonts,
                    dest: './src/css/fonts/',
                    flatten: true,
                    expand: true
                }, {
                    cwd: rootDir,
                    src: assembledComponents,
                    dest: './src/',
                    flatten: true,
                    expand: true
                }]
            },
            prod: {
                files: [{
                    cwd: rootDir,
                    src: assembledComponents,
                    dest: './dist/',
                    flatten: true,
                    expand: true
                }]
            }
        }
    });
    
    grunt.registerTask('default', ['concat', 'copy:dev']);
    grunt.registerTask('prod', ['concat', 'uglify', 'cssmin', 'copy:prod']);
}