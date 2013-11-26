
//create default route (or any route really...)

Todos.Router.map(function () {
  this.resource('todos', { path: '/' }, function () {
    // additional child routes
    this.route('active');
    this.route('completed');
  });
});

Todos.TodosIndexRoute = Ember.Route.extend({
  model: function () {
    return this.modelFor('todos');
  },
  renderTemplate: function(controller){
    this.render('index', {controller: controller});
  }
});

Todos.TodosActiveRoute = Ember.Route.extend({
  model: function(){
    return this.store.filter('todo', function (todo) {
      return !todo.get('isCompleted');
    });
  },
  renderTemplate: function(controller){
    this.render('index', {controller: controller});
  }
});

Todos.TodosCompletedRoute = Ember.Route.extend({
  model: function(){
    return this.store.filter('todo', function (todo) {
      return todo.get('isCompleted');
    });
  },
  renderTemplate: function(controller){
    this.render('index', {controller: controller});
  }
});


//route to get the Todos model and find all of the todos
Todos.TodosRoute = Ember.Route.extend({
	model: function() {
		return this.store.find('todo');
	}
});