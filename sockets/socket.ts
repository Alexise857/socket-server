import socketIO, { Socket } from 'socket.io'
import { UsuarioLista } from "../classes/usuario-lista"
import { Usuario } from "../classes/usuario";

export const usuariosConectados = new UsuarioLista()

/* La función conectarCliente es almacenar en la clase Usuario Lista el usuario logeado */

export const conectarCliente = ( cliente: Socket ) => {
    const usuario = new Usuario( cliente.id )
    usuariosConectados.agregar( usuario )
}

export const desconectar = ( cliente: Socket ) => {

    cliente.on('disconnect', () => {
        console.log('cliente desconectado')
        usuariosConectados.borrarUsuario( cliente.id )
    })

}

// Escuchar mensajes
export const mensaje = ( cliente: Socket, io: socketIO.Server ) => {

    cliente.on('mensaje', ( payload: { de: string, cuerpo: string } ) => {
        console.log( 'Mensaje recibido', payload )
        io.emit('mensaje-nuevo', payload)
    } )

}

// Configurar Usuario
export const configurarUsuario = (cliente: Socket, io: socketIO.Server ) => {

    cliente.on('configurar-usuario', ( payload: { nombre: string }, callback: Function ) => {

        // console.log('configurando usuario', payload)

        usuariosConectados.actualizarNombre( cliente.id, payload.nombre )

        callback({
            ok: true,
            mensaje: `Usuario ${payload.nombre} configurado`
        })

    })

}


/* Nota:
* En este archivo tendremos las configuraciones / opciones de cada acción
* que dispararemos desde el disconnect / connect
*
* cliente: sera el argumento que me dira si se conecto o desconecto
*
* El this.io tiene conocimiento de que personas están conectadas, lo podemos usar
* para enviar el mensaje a todos los usuarios conectados.
* Aprovechando que JS pasa por referencia los objetos tenemos accesos a las propiedades si lo pasamos como argumento
* */