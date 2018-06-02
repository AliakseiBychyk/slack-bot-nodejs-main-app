const http = require('http');
const service = require('../server/service');
const slackClient = require('../server/slackClient');
const token = require('../secret/token');

const server = http.createServer(service);

// An access token (from Slack app or custom integration - usually xoxb)
const slackToken = process.env.SLACK_TOKEN || token;
const slackLogLevel = 'info'; // 'debug'

const rtm = slackClient.init(slackToken, slackLogLevel);

rtm.start();
// This argument can be a channel ID, a DM ID, a MPDM ID, or a group ID
const conversationId = 'CAZV5QNAV';


// The RTM client can send simple string message
rtm.sendMessage('Hello there again!', conversationId)
  .then(res => {
    // `res` contains information about the posted message
    console.log('Message sent: ', res.ts);
  })
  .catch(console.error);

slackClient.addAuthenticatedHandler(rtm, () => server.listen(3000));

server.on('listening', () => {
  console.log(`Server is listening on ${server.address().port} in ${service.get('env')} mode`);
});

