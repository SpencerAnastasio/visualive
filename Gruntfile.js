'use strict';

module.exports = function(grunt){
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  var config = {};

  config['jshint'] = {
    server: {
      options: {
        jshintrc: '.server.jshintrc',
        reporter: require('jshint-stylish')
      },
      src: ['app/app.js', 'app/routes/*.js', 'app/models/*.js', 'app/lib/*.js', 'config/*.js', '!app/lib/instagram.example.js']
    },
    browser: {
      options: {
        jshintrc: '.browser.jshintrc',
        reporter: require('jshint-stylish')
      },
      files: {
        src: ['app/static/js/source/*.js']
      }
    }
  },

  config['watch'] = {
    options: {
      spawn: false
    },
    server: {
      files: ['app/app.js', 'app/lib/*.js', 'app/routes/*.js', 'app/models/*.js', 'config/*.js'],
      tasks: ['jshint:server']
    },
    browser: {
      files: ['app/static/js/**/*.js'],
      tasks: ['jshint:browser'],
      options: {
        livereload: true
      }
    },
    css: {
      files: ['app/static/css/**/*.css'],
      tasks: [],
      options: {
        livereload: true
      }
    },
    views: {
      files: ['app/views/**/*.ejs'],
      tasks: [],
      options: {
        livereload: true
      }
    }
  //  specs: {
  //    files: ['app/specs/**/*.js'],
  //    tasks: ['jasmine_node']
  //  }
  },

  // config['clean'] = {
  //   build   : {
  //     files : [{
  //       dot : true,
  //       src : [
  //       'dist/*',
  //       '!dist/.git*'
  //       ]
  //     }]
  //   }
  // };
  //
  // config['useminPrepare'] = {
  //   options : {
  //     dest  : 'dist'
  //   },
  //   html    : 'src/index.html'
  // };
  //
  // config['htmlmin'] = {
  //   build                         : {
  //     options                     : {
  //       collapseBooleanAttributes : true,
  //       removeAttributeQuotes     : true,
  //       removeRedundantAttributes : true,
  //       removeEmptyAttributes     : true
  //     },
  //     files                       : [{
  //       expand                    : true,
  //       cwd                       : 'src',
  //       src                       : '{,*/}*.html',
  //       dest                      : 'dist'
  //     }]
  //   }
  // };
  //
  // config['uglify'] = {
  //   options  : {
  //     mangle : false
  //   }
  // };
  //
  // config['rev'] = {
  //   files : {
  //     src : [
  //     'dist/scripts/{,*/}*.js',
  //     ]
  //   }
  // };
  //
  // config['usemin'] = {
  //   options : {
  //     dirs  : ['dist']
  //   },
  //   html    : ['dist/{,*/}*.html']
  // };

  grunt.initConfig(config);

  // var tasks = [
  //   'clean',
  //   'useminPrepare',
  //   'htmlmin',
  //   'concat',
  //   'uglify',
  //   'rev',
  //   'usemin'
  // ];

  grunt.registerTask('default', ['jshint', 'watch']);
  // grunt.registerTask('build', tasks);
};
