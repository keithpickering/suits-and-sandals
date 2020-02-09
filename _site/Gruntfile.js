/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    // Task configuration.
    concat: {
      dist: {
        src: ['assets/js/lazyload.min.js',
              'assets/js/glide.js',
              'assets/js/swup.min.js',
              'assets/js/shuffle.min.js',
              'assets/js/suits-sandals.js'],
        dest: 'assets/js/main.js'
      }
    },
    uglify: {
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'assets/js/main.min.js'
      }
    },
    watch: {
      scripts: {
        files: ['assets/js/*.js'],
        tasks: ['default']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify-es');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', ['concat', 'uglify']);
};
