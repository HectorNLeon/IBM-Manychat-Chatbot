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
var searchResponse = {
  "version": "v2",
  "content": {
    "messages": [
      {
        "type": "cards",
        "elements": [
        ],
        "image_aspect_ratio": "horizontal"
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
      console.log(output)
      if(Array.isArray(output)){
        output.forEach( element =>{
          searchResponse.content.messages[0].elements.push(
            {title: element.title, subtitle: element.body, image_url: "https://store.tec.mx/6545-thickbox_default/sudadera-tec-borregos-hf17003.jpg", action_url: "https://store.tec.mx/"}
          )
        });
        res.status(200);
        res.send(searchResponse);
      }
      else{
        response.content.messages[0].text = output
        res.status(200);
        res.send(response);
      }
      
    })
    .catch(next);
};
