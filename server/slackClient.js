const { RTMClient } = require('@slack/client');

let rtm = null;
let nlp = null;
let registry = null;

const handleOnAuthenticated = connectData => {
  console.log(`Logged in as ${connectData.self.name} of team ${connectData.team.name}`);
};

function addAuthenticatedHandler(rtm, handler) {
  rtm.on('authenticated', connectData => {
    handler(connectData);
  });
}

function handleOnMessage(message) {
  if (message.text.toLowerCase().includes('bibop-bot')) {
    nlp.ask(message.text, (err, res) => {
      if (err) return console.error(err);

      const { location, intent } = res.entities;

      try {
        if (!intent || !intent[0] || !intent[0].value) {
          throw new Error('Coulld not extract intent.');
        }
        const handlingIntent = require(`./intents/${intent[0].value}Intent`);

        handlingIntent.process(res.entities, registry, (err, response) => {
          if (err) return console.error(err);
          return rtm.sendMessage(response, message.channel)
            .then()
            .catch(console.error);
        });
      } catch (err) {
        console.error(err);
        console.error(res);
        rtm.sendMessage('Sorry, I don\'t know what you are talking about', message.channel)
          .catch(console.error);
      }

      // if (!intent) {
      //   return rtm.sendMessage('Sorry, I don\'t know what you are talking about', message.channel)
      //     .catch(console.error);
      // } else if (intent[0].value === 'time' && location) {
      //   return rtm.sendMessage(`I don't yet know the time in ${location[0].value}`, message.channel)
      //     .catch(console.error);
      // }

      // rtm.sendMessage(`Nice to hear you, ${message.user}!`, message.channel)
      //   .then(res => {
      //     console.log('Message sent: ', res.ts);
      //   })
      //   .catch(console.error);
    });
  }
}


module.exports.init = function slackClient(token, logLevel, nlpClient, serviceRegistry) {
  // The client is initialized and then started to get an active connection to the platform
  rtm = new RTMClient(token, { logLevel });
  nlp = nlpClient;
  registry = serviceRegistry;

  rtm.on('message', message => handleOnMessage(message));

  addAuthenticatedHandler(rtm, handleOnAuthenticated);
  return rtm;
};

module.exports.addAuthenticatedHandler = addAuthenticatedHandler;
