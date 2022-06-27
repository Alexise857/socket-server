import Server from "./classes/server";
import router  from "./routes/router";
import bodyParser from "body-parser";
import cors from 'cors'

const server = Server.Instance

// BodyParser
// configuración para agregar el middleware de bodyparser
server.app.use( bodyParser.urlencoded( { extended: true } ) );
// Pase la petición del formato JSON
server.app.use( bodyParser.json() )

// CORS
// Permitiendo que cualquier persona pueda llamar mi servicio
server.app.use( cors({ origin: true, credentials: true }) )

// Rutas de servicio
// configuración para usar las rutas
server.app.use('/', router)

server.start( () => {
    console.log( ' servidor corriendo en puerto ', server.port )
} )


