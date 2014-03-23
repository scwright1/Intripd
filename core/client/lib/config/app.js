require('../vendor/jquery');
require('../vendor/jquery.cookie');
require('../vendor/bootstrap-datepicker');
require('../vendor/handlebars');
require('../vendor/ember');
require('../vendor/ember-data');

window.App = Ember.Application.create();

var App = window.App;

App.ApplicationAdapter = DS.RESTAdapter.extend({
	namespace: 'api'
});

App.Store = DS.Store.extend({
	adapter: App.ApplicationAdapter
});

module.exports = App;