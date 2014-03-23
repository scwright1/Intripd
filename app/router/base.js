var nodemailer = require('nodemailer');

module.exports = function(server) {
	server.all('/api', function(req, res) {
		res.send('Intripd API is running');
		//TODO - redirect to 401 page
	});

	server.post('/bug', function(req, res) {
		var data = req.body.desc + "\n\n\n=========Agent Report=========\n\n" + req.body.agent;
		var htmlData = data.replace(/\n/g, "<br />");
		var date = new Date();
		var sendDate = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + " - " + date.getHours() + ":" + date.getMinutes() + ":"+  date.getSeconds();
		// create reusable transport method (opens pool of SMTP connections)
		var smtpTransport = nodemailer.createTransport("SMTP",{
		    service: "Gmail",
		    auth: {
		        user: "ste.c.wr@gmail.com",
		        pass: "Cj57436X"
		    }
		});

		var sendmailTransport = nodemailer.createTransport("sendmail");

		// setup e-mail data with unicode symbols
		var mailOptions = {
		    from: "Intripd Bug Report <bugs@intripd.com>", // sender address
		    to: "ste.c.wr@gmail.com", // list of receivers
		    subject: "[BUG REPORT] - "+sendDate, // Subject line
		    text: data,
		    html: htmlData // html body
		}

		// send mail with defined transport object
		sendmailTransport.sendMail(mailOptions, function(error, response){
		    if(error){
		        console.log(error);
		    }else{
		        console.log("Message sent: " + response.message);
		    }

		    // if you don't want to use this transport object anymore, uncomment following line
		    sendmailTransport.close(); // shut down the connection pool, no more messages
		});
		res.send(200);
	});
};