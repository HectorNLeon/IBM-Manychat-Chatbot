// service.js

// Se importa la clase de AssistantV2 desde el paquete de ibm-watson
const AssistantV2 = require('ibm-watson/assistant/v2');

// Se importa la clase de IamAuthenticator desde el paquete de ibm-watson
const { IamAuthenticator } = require('ibm-watson/auth');

/* Se instancia el asistente utilizando como autentificador una instancia de IamAuthenticator
pasando como parámetro el api key contenido en el archivo .env */
const assistant = new AssistantV2({
    authenticator: new IamAuthenticator({ apikey: process.env.API_KEY }),
    url: process.env.API_URL,
    version: '2020-04-01'
});


/* La clase AssistantV2 tiene una funciónla cual crea la sesión
DOCUMENTACIÓN: https://cloud.ibm.com/apidocs/assistant/assistant-v2?code=node#create-a-session */


/* Variable que guarda las sesiones de los usuarios
La sesión es importante para que el chatbot sepa distinguir entre distintas conversaciones y usuarios
y de esta manera mantener el contexto del flujo de la conversación */
var usersChats = {};

//Funcion que revisa si ya ha pasado 4 minutos sin ningun nuevo mensaje para asi borrar la sesion del usuario
setInterval(function() {
    var time = Date.now();
    for( user in usersChats){
        if( time - usersChats[user].time >  4000 *60){
            console.log(time +" < " + usersChats[user].time)
            delete usersChats[user]
        }
    }
}, 500);


//Esta funcion recibe el body, se comunica con el chatbot y regresa el mensaje
exports.getMessage = function (body) {
    return new Promise((resolve, reject) => {
        if (!(body.user in usersChats)){ //Si el usuario no tiene una sesion con el chatbot
            assistant.createSession(
                {
                    assistantId: process.env.ASSISTANT_ID || '{assistant_id}',
                },
                function (error, response) {
                    if (error) {
                        reject(error)
                    } else {
                        usersChats[body.user] =  {sessionId : response.result.session_id, time: Date.now()}
                        console.log(usersChats)
                        resolve(response.result.session_id)
                    }
                }
            );
        }
        else{ 
            usersChats[body.user].time = Date.now(); //Se reinicia el timer
            resolve(usersChats[body.user].sessionId);
        }
            
    }).then(sessionId => {
        return new Promise((resolve, reject) => {
            assistant.message(
                {
                    input: { text: body.input },
                    assistantId: process.env.ASSISTANT_ID,
                    sessionId: sessionId
                })
                .then(response => {
                    if(response.result.output.generic[0].response_type == "search"){ //Si la respuesta es tipo de busqueda
                        if(response.result.output.generic[0].header == "No tenemos productos con ese criterio") //Por si la search skill no encuentra nada
                            resolve(response.result.output.generic[0].header)
                        resolve(response.result.output.generic[0].results)
                    }
                    resolve(response.result.output.generic[0].text)
                })
                .catch(err => {
                    console.log(err);
                    reject(err)
                });
        });
    });
}
