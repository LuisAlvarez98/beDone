var restify = require('restify');
var builder = require('botbuilder');
var apiairecognizer = require('api-ai-recognizer');
var request = require('request');
//database connection
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "database_hack"
});
//end database connection
// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users
server.post('/api/messages', connector.listen());

// This is a dinner reservation bot that uses a waterfall technique to prompt users for input.
var bot = new builder.UniversalBot(connector, [
  function (session) {
      session.send("Kill me");
      session.beginDialog('test');
  },

]);

var recognizer = new apiairecognizer("84726c991e6645c4bdc7e39b44102686");
var intents = new builder.IntentDialog({
         recognizers: [recognizer]
});

bot.dialog('test', intents);


intents.matches('events', function(session, args){
    session.send('you have 2 homeworks for tomorrow');
    // guardar aqui la fecha, evento etc
    con.connect(function(err) {
      if (err) throw err;
      console.log("Connect-ED!");
      var sql = "INSERT into tasks (task) VALUES ('jajajaja')";
      con.query(sql, function(err,result){
       if(err) throw err;
       console.log("1 Record inserted");

    });
    });
});

intents.matches('cancel', function(session, args){
    session.send('dafuq');
});

//event events
//show con datos
//no se si se puede guardar cerrar y que todavia esten aqui
