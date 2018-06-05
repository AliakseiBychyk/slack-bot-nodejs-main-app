const request = require('superagent');

module.exports.process = function process(intentData, registry, cb) {
  if (intentData.intent[0].value !== 'time') {
    return cb(new Error(`Expected time intent, got ${intentData.intent[0].value}`));
  }

  if (!intentData.location) {
    return cb(new Error('Missing location in time intent'));
  }

  const location = intentData.location[0].value.replace(/,.?bibop-bot/i, '');

  const service = registry.get('time');
  if (!service) return cb(false, 'No service available');

  request.get(`http://${service.ip}:${service.port}/service/${location}`)
    .end((err, res) => {
      if (err || res.statusCode !== 200 || !res.body.result) {
        console.error(err);
        console.log(res.body);
        return cb(false, `I had problem finding out the time in ${location}`);
      }

      console.log(res.body.result);
      return cb(false, `In ${location} it is now ${res.body.result}`);
    });
};
