const { RTMClient } = require('@slack/client');

let rtm = null;

const handleOnAuthenticated = connectData => {
  console.log(`Logged in as ${connectData.self.name} of team ${connectData.team.name}`)
}

function addAuthenticatedHandler(rtm, handler) {
  rtm.on('authenticated', connectData => {
    handler(connectData);
  });
};

function handleOnMessage(message) {
  console.log(message);
  const conversationId = message.channel
  rtm.sendMessage(`Nice to hear you, ${message.user}!`, conversationId)
    .then(res => {
      console.log('Message sent: ', res.ts);
    })
    .catch(console.error)
}



module.exports.init = function slackClient(token, logLevel) {
  // The client is initialized and then started to get an active connection to the platform
  rtm = new RTMClient(token, { logLevel });

  rtm.on('message', message => handleOnMessage(message))

  addAuthenticatedHandler(rtm, handleOnAuthenticated);
  return rtm;
};

module.exports.addAuthenticatedHandler = addAuthenticatedHandler;