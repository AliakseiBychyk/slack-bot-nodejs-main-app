const { RTMClient } = require('@slack/client');

const handleOnAuthenticated = connectData => {
  console.log(`Logged in as ${connectData.self.name} of team ${connectData.team.name}`)
}

function addAuthenticatedHandler(rtm, handler) {
  rtm.on('authenticated', connectData => {
    handler(connectData);
  });
};

module.exports.init = function slackClient(token, logLevel) {
  // The client is initialized and then started to get an active connection to the platform
  const rtm = new RTMClient(token, { logLevel });

  addAuthenticatedHandler(rtm, handleOnAuthenticated);
  return rtm;
};

module.exports.addAuthenticatedHandler = addAuthenticatedHandler;