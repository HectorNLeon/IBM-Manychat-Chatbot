# IBM Chatbot - Manychat

Este proyecto requiere tener NodeJS instalado, es una implementación entre el chatbot en IBM Watson y Manychat.


### Instalación
Es necesario tener esta api hosteada en un servidor público para poder ser implementada con manychat.


### Herramientas utilizadas
- NodeJS
- Express
- IBM Watson AssistantV2

### Para utilizarlo correctamente.
Para poder correr el código hay que crear un archivo .env que tenga el siguiente formato </br>
ASSISTANT_ID=[TU ID DEL ASISTENTE]</br>
ASSISTANT_URL=[TU URL DE TU ASISTENTE]</br>
API_KEY=[LA LLAVE DE LA API DE TU ASISTENTE]</br>
El .env va en la carpeta raíz.</br>
Estos datos pueden ser encontrado en la parte de Settings del asistente. 

### Correr el proyecto
Se utiliza el comando `npm start` para correr el proyecto.

![Implementation](img/diag.png?raw=true "Diagrama")

