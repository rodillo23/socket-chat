const { io } = require('../server');
const {Usuarios} = require('../classes/usuarios')
const {crearMensaje} = require('../utils/utilidades')

const usuarios = new Usuarios()


//cliente conectado
io.on('connection', (client) => {

    //emitimos los usuarios conectados al chat
    client.on('entrarChat', (usuario, callback) => {
      
        console.log(usuario)

        if(!usuario.nombre || !usuario.sala){
            return callback({
                err : true,
                mensaje : 'El nombre/sala es necesario'
            })
        }

        client.join(usuario.sala)

        usuarios.agregarPersona(client.id, usuario.nombre, usuario.sala  )
        
        client.broadcast.to(usuario.sala).emit('listaPersonas', usuarios.getPersonasPorSala(usuario.sala))

        callback(usuarios.getPersonasPorSala(usuario.sala))
    })

    //emitimos un mensaje a todos los usuarios
    client.on('crearMensaje', (data) => {
        let persona = usuarios.getPersona(client.id)

        let mensaje = crearMensaje(persona.nombre, data.mensaje)
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje)
    })

    //mensaje privado
    client.on('mensajePrivado', (data) => {
        let persona = usuarios.getPersona(client.id)
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje))
    })

    client.on('disconnect', ()=>{
        let personaBorrada = usuarios.deletePersona(client.id)

        //emite la salida de un usuario
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Admin', `${personaBorrada.nombre} abandono el chat`))

        client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonasPorSala(personaBorrada.sala))

    })

});