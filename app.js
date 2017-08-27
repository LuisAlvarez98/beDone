var restify = require('restify');
var builder = require('botbuilder');
var apiairecognizer = require('api-ai-recognizer');
var request = require('request');

//con

var mysql = require('mysql');

 var con = mysql.createConnection({
  host: "localhost",
   user: "root",
   password: "",
  database: "database_hack"
 });
//endcon
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
//server.post('/api/messages', connector.listen());
server.post('/api/messages', connector.listen());


// This is a dinner reservation bot that uses a waterfall technique to prompt users for input.
var bot = new builder.UniversalBot(connector, [
  function (session) {

    var card = createHeroCard(session);

     // attach the card to the reply message
     var msg = new builder.Message(session).addAttachment(card);
     session.send(msg);

      session.send("What can I do for you today?");

      session.beginDialog('main');
  },

]);

function createHeroCard(session) {
    return new builder.HeroCard(session)
        .title('Welcome to beDone!')
        .subtitle('Your personal homework assistant')
        .images([
            builder.CardImage.create(session, 'https://raw.githubusercontent.com/LuisAlvarez98/beDone/master/icon.png')
        ])

}

var recognizer = new apiairecognizer("84726c991e6645c4bdc7e39b44102686");
var intents = new builder.IntentDialog({
         recognizers: [recognizer]
});

bot.dialog('main', intents);


intents.matches('show tasks', function(session, args){
    let num = 5;
    session.send("I found %s tasks.", num);

    for (i = 0; i < 5; i++){
      var title = "Event";
      var time = "00:00";
      var date = "Monday";
      var card = createEventCard(session, title, time, date);

       // attach the card to the reply message
       var msg = new builder.Message(session).addAttachment(card);
       session.send(msg);

    }

    var date = builder.EntityRecognizer.findEntity(args.entities,'day');
    var date_name = date.entity;
    session.send("Date: " + date_name);

    var task = builder.EntityRecognizer.findEntity(args.entities,'work');
    var task_name = task.entity;
    session.send("Task: " + task_name);
    //sprintf('%', date);

    // guardar aqui la fecha, evento etc
});

intents.matches('create task', function(session, args){
    session.send("Got it. I'll make a note of it for you");

    var date = builder.EntityRecognizer.findEntity(args.entities,'date');
    var date_name = date.entity;
    session.send("Date: " + date_name);

    var task = builder.EntityRecognizer.findEntity(args.entities,'work');
    var task_name = task.entity;
    session.send("Task: " + task_name);

    var time = builder.EntityRecognizer.findEntity(args.entities,'time');
    var time_name = time.entity;
    session.send("Time: " +  time_name);

    var course = builder.EntityRecognizer.findEntity(args.entities,'course');
    var course_name = course.entity;
    session.send("Course: " + course_name);


    con.connect(function(err) {
        if (err) throw err;
          console.log("Connect-ED!");
          var sql = "INSERT into tasks SET date=?, time=?, subject_name=?, task=?";
          con.query(sql,[date_name, time_name, course_name, task_name], function(err,result){
           if(err) throw err;
        });
    });
});

intents.onDefault(function(session){
    session.send("Hmm...could you please rephrase?");
});


function createEventCard(session, title, time, date) {
    return new builder.HeroCard(session)
        .title(title)
        .subtitle(date)
        .text(time)
}

//event events
//show con datos
//no se si se puede guardar cerrar y que todavia esten aqui
