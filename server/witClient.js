const request = require('superagent');

function handleWitResponse(res) {
  // console.log('body: \n', JSON.stringify(res));
  return res;
}

module.exports = function witClient(token) {
  const ask = (message, cb) => {

    request.get('https://api.wit.ai/message?v=20180602&q=')
      .set('Authorization', `Bearer ${token}`)
      .query({ v: '20180602' })
      .query({ q: message })
      .end((err, res) => {
        if (err) return cb(err);
        if (res.statusCode !== 200) return cb('Expected status 200 but got ' + res.statusCode);
        const witResponse = handleWitResponse(res.body);
        return cb(null, witResponse);
      });
  };

  return {
    ask,
  };
};
