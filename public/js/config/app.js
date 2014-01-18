// require other, dependencies here, ie:
// require('./vendor/moment');

require('../vendor/jquery');
require('../vendor/jquery.cookie');
require('../vendor/handlebars');
require('../vendor/ember');
require('../vendor/ember-data'); // delete if you don't want ember-data

window.App = Ember.Application.create();

var App = window.App;

App.ApplicationAdapter = DS.RESTAdapter.extend({
	namespace: 'api'
});

App.Store = DS.Store.extend({
	adapter: App.ApplicationAdapter
});

Ember.onLoad('Ember.Application', function(Application) {
  Application.initializer({
    name: "injectStoreIntoMarker",
    after: "store",
    initialize: function(container, application) {   
      	application.inject('component', 'store', 'store:main');
    }
  });
})

module.exports = App;

