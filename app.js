const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
	res.sendFile(__dirname+"/signup.html");
});

app.post("/", function(req, res){
	const firstName = req.body.fname;
	const lastName = req.body.lname;
	const email = req.body.email;

	const data = {
		members: [
		{
			email_address: email,
			status: "subscribed",
			merge_fields: {
				FNAME: firstName,
				LNAME: lastName
			}


		}]
	};

	const jsonData = JSON.stringify(data);

	const url = "https://us14.api.mailchimp.com/3.0/lists/a0e51f2031";

	const options = {
		method: "POST",
		auth: "rock45:b091909a70e1e7e5744cb00073a891eb-us14"
	}

	const request = https.request(url, options, function(response){

		if(response.statusCode === 200) {
			res.sendFile(__dirname+"/success.html");
		} else res.sendFile(__dirname+"/failure.html");
		response.on("data", function(data){
			console.log(JSON.parse(data));
		});
	});


	request.write(jsonData);
	request.end();


	app.post("/failure", function(req, res){
		res.redirect("/");
	})

})

// Api Id - b091909a70e1e7e5744cb00073a891eb-us14
// Aud Id - a0e51f2031












app.listen(process.env.PORT || 3000, function(){
	console.log("Server is running on port 3000");
});
