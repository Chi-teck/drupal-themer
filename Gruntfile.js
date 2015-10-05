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
                            'jquery-ui/jquery-ui.min.js',
                            'jquery.min.js',
                            'jquery-ui/jquery-ui.min.css',
                            'jquery-ui/jquery-ui.theme.min.css',
                            'jquery-ui/images/*'
                        ],
                        dest: 'dist/'
                    }
                ]
            }
        },
        replace: {
            "jquery-ui": {
                src: ['dist/jquery-ui/jquery-ui.min.css', 'dist/jquery-ui/jquery-ui.theme.min.css'],
                dest: 'dist/jquery-ui/',
                replacements: [
                    {
                        from: '("images/ui-',
                        to: '("chrome-extension://__MSG_@@extension_id__/jquery-ui/images/ui-'
                    }
                ]
            }

        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-text-replace');

    var defaultTasks = [
        'clean',
        'copy',
        'replace'
    ];
    grunt.registerTask('default', defaultTasks);

};
