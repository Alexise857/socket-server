import socketIO, { Socket } from 'socket.io'

export const desconectar = ( cliente: Socket ) => {

    cliente.on('disconnect', () => {
        console.log('cliente desconectado')
    })

}

// Escuchar mensajes
export const mensaje = ( cliente: Socket, io: socketIO.Server ) => {

    cliente.on('mensaje', ( payload: { de: string, cuerpo: string } ) => {
        console.log( 'Mensaje recibido', payload )
        io.emit('mensaje-nuevo', payload)
    } )

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