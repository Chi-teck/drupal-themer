module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ['dist/*'],
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        src: [
                            'manifest.json',
                            'background.js',
                            'content.js',
                            'content.css',
                            'images/*.png',
                            'bower_components/jquery/dist/jquery.min.js',
                            'bower_components/jquery-ui/jquery-ui.min.js',
                            'bower_components/jquery-ui/themes/redmond/*',
                            'bower_components/jquery-ui/themes/redmond/images/*'
                        ],
                        dest: 'dist/'
                    }
                ]
            }
        },
        replace: {
            "jquery-ui": {
                src: [
                    'dist/bower_components/jquery-ui/themes/redmond/jquery-ui.min.css',
                    'dist/bower_components/jquery-ui/themes/redmond/theme.css'
                ],
                dest: 'dist/bower_components/jquery-ui/themes/redmond/',
                replacements: [
                    {
                        from: '("images/ui-',
                        to: '("chrome-extension://__MSG_@@extension_id__/bower_components/jquery-ui/themes/redmond/images/ui-'
                    }
                ]
            }

        },
        watch: {
            scripts: {
                files: [
                    'background.js',
                    'content.js',
                    'content.css'
                ],
                tasks: ['default']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-contrib-watch');

    var defaultTasks = [
        'clean',
        'copy',
        'replace'
    ];
    grunt.registerTask('default', defaultTasks);

};
