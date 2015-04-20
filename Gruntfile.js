module.exports = function (grunt) {
    var name = '<%= pkg.name %>-v<%= pkg.version%>';

    // Project configuration.
    grunt.initConfig({
        pkg:grunt.file.readJSON('package.json'),
        copy:{
            main:{
                files:[
                    // Copy images
                    {expand:true, src:['img/**'], dest:'release/', filter:'isFile'},
                    // Copy *.min.css
                    {expand:true, src:['css/**/*.min.css'], dest:'release/'},
                    // Copy  Js/lib
                    {expand:true, src:['js/lib/**'], dest:'release/', filter:'isFile'},
                    // copy requireJS lib
                    {expand:true, src:['js/*.js'], dest:'release/'}
                ]
            }
        },
        uglify:{
            options:{
                banner:'/*! <%= pkg.name %>-v<%= pkg.version%> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },

            min:{
                files:grunt.file.expandMapping(['js/app/**/*.js'], 'release/', {
                    rename:function (destBase, destPath) {
                        return destBase + destPath.replace('.js', '.min.js');
                    }
                })
            }

        },
        cssmin:{
            min:{
                files:[
                    {
                        expand:true,
                        cwd:'css',
                        src:['*.css', '!*.min.css'],
                        dest:'release/css',
                        ext:'.min.css'
                    }
                ]
            }
        },
        compress:{
            main:{
                options:{
                    archive:'release/<%= pkg.name %>-v<%= pkg.version%>.zip'
                },
                expand:true,
                cwd:'release/',
                src:['**/*']
                // dest: 'dest/'
            }
        },
        clean:["release/css", "release/img", "release/js"]
    });

    // Load Uglify
    grunt.loadNpmTasks('grunt-contrib-uglify');
    // Load Cssmin
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    // Load Copy
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Task list
    grunt.registerTask('default', ['uglify', 'cssmin', 'copy', 'compress', 'clean']);

};