const { RTMClient } = require('@slack/client');

module.exports.init = function slackClient(token, logLevel) {
  // The client is initialized and then started to get an active connection to the platform
  const rtm = new RTMClient(token, logLevel);

  return rtm;
} 
