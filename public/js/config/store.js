DS.RESTAdapter.reopen({
	namespace: 'v1'
});

module.exports = DS.Store.extend({
	version: 12
});