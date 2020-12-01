// controller.js

// Se importa la función de getMessage de ./service.js
const getMessage = require('./service').getMessage;

//Estos son formatos de manychat  https://manychat.github.io/dynamic_block_docs/
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
      if(Array.isArray(output)){ //Si la respuesta es un search query 
        searchResponse.content.messages[0].elements = [] //Vacia los elementos
        for(let i= 0; i<10 && i< output.length; i++){ //Manychat solo permite 10
          searchResponse.content.messages[0].elements.push(
            {title: output[i].title, subtitle: output[i].body, 
              image_url: "https://store.tec.mx/6545-thickbox_default/sudadera-tec-borregos-hf17003.jpg", 
              action_url: "https://store.tec.mx/"} //image_url y action_url estan hardcodeados ya que no se encontraban en el catalogo, 
                                                  // se debe actualizar el catalogo
          )
        }
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
