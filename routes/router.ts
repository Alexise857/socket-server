import { Router, Request, Response } from 'express'
import Server from "../classes/server";
import { usuariosConectados } from "../sockets/socket";

const router = Router();

router.get('/mensajes',( req: Request, res: Response ) => {
    res.json({
        ok: true,
        mensaje: 'todo esta bien'
    })
})

router.post('/mensajes',( req: Request, res: Response ) => {

    const cuerpo = req.body.cuerpo
    const de     = req.body.de

    const server = Server.Instance
    const payload = {
        de,
        cuerpo
    }

    server.io.emit('mensaje-nuevo', payload )

    res.json({
        ok: true,
        cuerpo,
        de
    })

})

router.post('/mensajes/:id',( req: Request, res: Response ) => {

    const cuerpo = req.body.cuerpo
    const de     = req.body.de
    const id     = req.params.id

    const payload = {
        de,
        cuerpo
    }

    // Conectar el servicio REST al de sockets
    // Como Server es singleton vamos a tener la misma instancia que tenemos corriendo en nuestra node app
    const server = Server.Instance

    // El in me sirve para mandarle un mensaje a una persona que se encuentre en un canal particular
    // Todos los clientes conectados al chat global que tienen una sala como su ID
    // Básicamente el usuario que tenga el ID que le pasemos el IN, será el único que reciba los mensajes
    server.io.in( id ).emit('mensaje-privado', payload )

    res.json({
        ok: true,
        cuerpo,
        de,
        id
    })

})

// Servicio para obtener todos los IDs de los usuarios
router.get('/usuarios', ( req: Request, res: Response ) => {

    const server = Server.Instance
    // all sockets in default namespace
    server.io.allSockets()
        .then( (clientes) => {
            console.log({clientes})
            res.json({
                ok:true,
                // clientes
                clientes: Array.from(clientes)
            });
        } )
        .catch( (err) => {
            res.json({
                ok:false,
                err
            })
        } )

} )

// Obtener usuarios y sus nombres
router.get('/usuarios/detalle', ( req: Request, res: Response ) => {

    res.json({
        ok:false,
        clientes: usuariosConectados.getLista()
    })

} )

export default router