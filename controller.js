// controller.js

// Se importa la función de getMessage de ./service.js
const getMessage = require('./service').getMessage;
var response = {
  "version": "v2",
  "content": {
    "messages": [
      {
        "type": "text",
        "text": "",
        "buttons": [
        ]
      }
    ],
    "actions": [],
    "quick_replies": []
  }
}
// Se exporta a ./index.js la función de ask.
exports.ask = (req, res, next) => {
  return getMessage(req.body)
    .then(output => {
      response.content.messages[0].text = output
      res.status(200);
      res.send(response);
    })
    .catch(next);
};

// Se exporta a ./index.js la función de initialize.
// No tiene funcionamiento por ahora.
exports.initialize = (req, res, next) => {
    return getSession()
      .then(output => {
        res.status(200);
        res.send(output);
      })
      .catch(next);
  };