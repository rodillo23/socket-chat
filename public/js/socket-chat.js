var socket = io();

//obtenemos los parametros de la url
var params = new URLSearchParams(window.location.search)

//si no viene el nombre lo redireccionamos al index
if(!params.has('nombre') || !params.has('sala')){
    window.location = 'index.html'
    alert('ingresa tu nombre o sala')
    throw new Error('El nombre y la sala son necesarios')
}

var usuario = {
    nombre : params.get('nombre'),
    sala : params.get('sala')
}

socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('entrarChat', usuario, function(resp){
        console.log('usuarios conectados', resp)
    })
});

// escuchar desconexion
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});

// Escuchar salida de usuario
socket.on('crearMensaje', function(mensaje) {

    console.log('Servidor:', mensaje);

});


//Escuchar cuando un usuario entra o sale
socket.on('listaPersonas', function(personas) {

    console.log('Lista actual:', personas);

});

// Crear mensaje
/* socket.emit('crearMensaje', {
    usuario: 'Fernando',
    mensaje: 'Hola Mundo'
}, function(resp) {
    console.log('respuesta server: ', resp);
}); */

//mensaje privado
socket.on('mensajePrivado', function(mensaje){
    console.log('Mensaje Privado: ', mensaje)
})
