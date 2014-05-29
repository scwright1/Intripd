var FooterView = Ember.View.extend({
	didInsertElement: function() {
		var today = new Date();
		document.getElementById("thisyear").innerHTML = today.getFullYear();
	}
});

module.exports = FooterView;