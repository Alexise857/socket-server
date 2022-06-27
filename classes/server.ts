import express from 'express'
// import socketIO from 'socket.io'
import socketIO from 'socket.io'
import http from "http";

import { SERVER_PORT } from "../global/enviroment";

import * as socket from '../sockets/socket'

export default class Server {

    private static _intance: Server;

    public app: express.Application
    public port: number

    public io!: socketIO.Server
    private httpServer: http.Server // Este seria el servidor que vamos a levantar

    private constructor() {
        this.app = express()
        this.port = SERVER_PORT
        this.httpServer = new http.Server( this.app )
    }

    start( callback: () => void ) {
        console.log('start server func')
        console.log(callback)
        this.httpServer.listen( this.port, callback )
        this.io = new socketIO.Server(this.httpServer, {
            cors: { origin: true, credentials: true },
        });
        this.escucharSockets()
    }

    public static get Instance() {
        // new this() es igual que decir new Server()
        // Le decimos si ya existe una instancia, regresa esa instancia
        return this._intance || ( this._intance = new this() )
    }

    private escucharSockets() {
        console.log('escuchando sockets')
        // Necesito escuchar cuando un cliente se conecta a mi app mediante socket
        this.io.on('connection', (cliente) => {
            console.log( `Cliente conectado ` )
            // console.log({cliente})

            // Mensajes
            socket.mensaje( cliente, this.io )

            // Desconectar
            socket.desconectar( cliente )


        } )
    }

}

/*
Notas:
Para inicializar el IO, necesita recibir la configuracion del servidor que esta corriendo en este momentp.}
Entonces, seria el app de express, pero socket y express no trabajan de la mano.
Se necesita un intermediario, el http

HTTP: lo que hace express tras bastidores es levantar un servidor http

Static: algo static es algo que puedo llamar directamente haciendo referencia a la clase
*/

