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

/* Función para crear la sesión inicial.
La sesión es importante para que el chatbot sepa distinguir entre distintas conversaciones y usuarios
y de esta manera mantener el contexto del flujo de la conversación */

var sessionId; // Se declara la variable en la que se guardará la sesión

/* La clase AssistantV2 tiene una funciónla cual crea la sesión
DOCUMENTACIÓN: https://cloud.ibm.com/apidocs/assistant/assistant-v2?code=node#create-a-session */
assistant.createSession(
    {
        assistantId: process.env.ASSISTANT_ID || '{assistant_id}',
    },
    function (error, response) {
        if (error) {
            console.log(error);
        } else {
            sessionId = response.result.session_id
            console.log(response.result.session_id);
        }
    }
);

exports.getMessage = function (body) {
    return new Promise((resolve, reject) => {
        assistant.message(
        {
            input: { text: body.input },
            assistantId: process.env.ASSISTANT_ID,
            sessionId: sessionId
        })
        .then(response => {
            console.log(JSON.stringify(response.result, null, 2));
            resolve(response.result.output.generic[0].text)
        })
        .catch(err => {
            console.log(err);
            reject(err)
        });
    });
}
