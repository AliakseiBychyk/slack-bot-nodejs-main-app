const { RTMClient } = require('@slack/client');

let rtm = null;
let nlp = null;

const handleOnAuthenticated = connectData => {
  console.log(`Logged in as ${connectData.self.name} of team ${connectData.team.name}`);
};

function addAuthenticatedHandler(rtm, handler) {
  rtm.on('authenticated', connectData => {
    handler(connectData);
  });
}

function handleOnMessage(message) {
  nlp.ask(message.text, (err, res) => {
    if (err) return console.error(err);

    const { location, intent } = res.entities;

    if (!intent) {
      return rtm.sendMessage('Sorry, I don\'t know what you are talking about', message.channel);
    } else if (intent[0].value === 'time' && location) {
      return rtm.sendMessage(`I don't yet know the time in ${location[0].value}`, message.channel);
    }

    rtm.sendMessage(`Nice to hear you, ${message.user}!`, message.channel)
      .then(res => {
        console.log('Message sent: ', res.ts);
      })
      .catch(console.error);
  });
}


module.exports.init = function slackClient(token, logLevel, nlpClient) {
  // The client is initialized and then started to get an active connection to the platform
  rtm = new RTMClient(token, { logLevel });
  nlp = nlpClient;

  rtm.on('message', message => handleOnMessage(message));

  addAuthenticatedHandler(rtm, handleOnAuthenticated);
  return rtm;
};

module.exports.addAuthenticatedHandler = addAuthenticatedHandler;
