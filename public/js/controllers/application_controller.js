var ApplicationController = Ember.ObjectController.extend({
	needs: 'sidebar.user',
	isAuthenticated: function() {
		return App.Session.isAuthenticated();
	}.property('App.Session.token'),
	profile: function() {
		var user = this.store.find('profile', App.Session.get('uid'));
		return user;
	}.property(),
	actions: {
		submitBug: function() {
			var bugdesc = $('#bugdesc').val();
			var email = $('#bug-email').val();
			if(bugdesc) {
				var agentData = "Browser CodeName: " + navigator.appCodeName;
				agentData+= "\nBrowser Name: " + navigator.appName;
				agentData+= "\nBrowser Version: " + navigator.appVersion;
				agentData+= "\nCookies Enabled: " + navigator.cookieEnabled;
				agentData+= "\nBrowser Language: " + navigator.language;
				agentData+= "\nBrowser Online: " + navigator.onLine;
				agentData+= "\nPlatform: " + navigator.platform;
				agentData+= "\nUser-agent header: " + navigator.userAgent;
				agentData+= "\nUser-agent language: " + navigator.systemLanguage;
				agentData+= "\nBrowser Viewport: "+ $(window).width() + 'x' + $(window).height();
				agentData+= "\nHTML Doc Size: "+ $(document).width() + 'x' + $(document).height();
				agentData+= "\nScreen Resolution: "+screen.width+'x'+screen.height;

				$.ajax({
					type: 'POST',
					url: '/bug',
					data: {desc: bugdesc, agent: agentData, email: email},
					dataType: 'json',
					complete: function() {
						$('#bugdesc').val('');
						$('#bug-email').val('');
						$('#bug-report-validation').removeClass('bug-validation-active');
						$('#bugdesc').css('border-color', '#000000');
						$('#bug-report-validation').html('');
						$('#bugReport').modal('hide');
						alert('Thankyou! Bug report submitted!');
					}
				});
			}
			else {
				$('#bugdesc').css('border-color', '#9f463a');
				$('#bug-report-validation').html('You must enter a bug description');
				$('#bug-report-validation').addClass('bug-validation-active');
			}
		}
	}
});

module.exports = ApplicationController;