var IndexRoute = Ember.Route.extend({
  model: function() {
    var store = this.get('store');
  }
});

module.exports = IndexRoute;