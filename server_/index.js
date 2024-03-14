import express from 'express';
import http from 'http';
import {Server as SocketServer} from 'socket.io';

//Creamos un servidor http para vincularlo a socket.io y poder establecer una comunicación a tiempo real.

const port = 4000;
const app = express();
const server = http.createServer(app);

//Indicamos la dirección del servidor donde se ejecuta el cliente
//Con * vale cualquier dirección

const io = new SocketServer(server, {
    cors: {
        origin: "*",
    }
});

//Establecemos una escucha para comprobar cuando se conecta un cliente:
io.on('connection', socket => {
    console.log('client connected');
    //Escucha de los clientes:
    socket.on('message', (data) => {
        console.log(data);
        //Enviamos el mensaje al resto de clientes menos al que lo ha enviado:
        socket.broadcast.emit('message', {
            body: data.body,
            from: data.from
        });

    })
})

server.listen(port);
console.log('Server listening on port: ' + port);