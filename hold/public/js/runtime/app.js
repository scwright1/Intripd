/**
 * Application entry point
 * 
 * Clientside code - Intripd-Ember-Node
 * 
 * ste.c.wr@gmail.com
 **/

window.Intripd = Ember.Application.create();

//Define Data API entry point (versioned)
Intripd.ApplicationAdapter = DS.RESTAdapter.extend({
	namespace: 'api/v1'
});