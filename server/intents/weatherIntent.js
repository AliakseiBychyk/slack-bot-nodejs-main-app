const request = require('superagent');

module.exports.process = function process(intentData, registry, cb) {
  if (intentData.intent[0].value !== 'weather') {
    return cb(new Error(`Expected weather intent, got ${intentData.intent[0].value}`));
  }

  if (!intentData.location) {
    return cb(new Error('Missing location in weather intent'));
  }

  const location = intentData.location[0].value.replace(/,.?bibop-bot/i, '');

  const service = registry.get('weather');
  if (!service) return cb(false, 'No service available');

  request.get(`http://${service.ip}:${service.port}/service/${location}`)
    .end((err, res) => {
      if (err || res.statusCode !== 200 || !res.body.result) {
        console.error(err);
        console.log(res.body);
        return cb(false, `I had problem finding out the weather in ${location}`);
      }

      console.log(res.body.result);
      return cb(false, `The current weather in ${location} is ${res.body.result}`);
    });
}
;
