module.exports = function(grunt) {
  grunt.initConfig({
    emberTemplates: {
      options: {
        templateBasePath: /public\/templates\//
      },
      compile: {
        files: {
          "public/js/templates/templates.js": ["public/templates/*.handlebars"]
        }
      }
    } 
  });
  grunt.loadNpmTasks('grunt-ember-templates');
  grunt.registerTask('default', ['emberTemplates']);
};