var restify = require('restify');
var builder = require('botbuilder');

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
      session.beginDialog('test');
  },

]);

bot.dialog('test', [
  function (session) {
      session.send("Welcome to the homework scheduler.");
      builder.Prompts.time(session, "Please provide a homework date and time (e.g.: June 6th at 5pm)");
  },
  function (session, results) {
      session.dialogData.homeworkDate = builder.EntityRecognizer.resolveTime([results.response]);
      builder.Prompts.text(session, "What is the class name?");
  },
  function (session, results) {
      session.dialogData.className = results.response;
      builder.Prompts.text(session, "What is your name?");
  },
  function (session, results) {
      session.dialogData.studentName = results.response;

      // Process request and display reservation details
      session.send("Homework received. Homework details: <br/>Date: %s <br/>Class name: %s <br/>Student name: %s",
          session.dialogData.homeworkDate, session.dialogData.className, session.dialogData.studentName);
      session.endDialog();
  }
]);






// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
