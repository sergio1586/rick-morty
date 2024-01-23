$(document).ready(() => {
    var select = $('#paginas');
    for (var i = 1; i <= 42; i++) {
        var option = $('<option></option>');
        option.val(i).text(i);
        select.append(option);
    }

    $('button').on('click', function () {
        console.log('Botón clicado');
        console.log('Página seleccionada:', select.val());
        mostrarIndicadorDeCarga();
        obtenerPersonajes();
    });
    

    function obtenerPersonajes() {
        $.ajax({
            url: '/datos',
            type: 'POST',
            dataType: 'json',
            data: { seleccion: select.val() },
            success: function (personajes) {
                ocultarIndicadorDeCarga();
                mostrarPersonajes(personajes);
            },
            error: function (error) {
                ocultarIndicadorDeCarga();
                console.error('Error al obtener personajes', error.responseText);
            }
        });
    }

    function mostrarPersonajes(personajes) {
        const contenedorPersonajes = $('#listaPersonajes');
        contenedorPersonajes.html('');
    
        $.each(personajes, function(index, personaje) {
            const divCarta = $('<div>').addClass('card mb-4 col-12 col-sm-4');
    
            // Crear la imagen y agregarla a la carta
            const imagenPersona = $('<img>').addClass('card-img-top');
            imagenPersona.attr('src', personaje.image);
            
            // Crear la sección de cuerpo de la carta
            const divCuerpo = $('<div>').addClass('card-body');
            
            // Crear el nombre y agregarlo a la carta
            const nombre = $('<h5>').addClass('card-title').text(personaje.name);
            
            // Crear el contenido del cuerpo de la carta
            const contenidoCuerpo = $('<p>').addClass('card-text').text('Información adicional si es necesaria.');
            
            // Agregar la imagen, el nombre y el contenido al cuerpo de la carta
            divCuerpo.append(imagenPersona, nombre, contenidoCuerpo);
            
            // Agregar el cuerpo de la carta a la carta
            divCarta.append(divCuerpo);
            
            // Agregar la carta al contenedor general
            contenedorPersonajes.append(divCarta);
        });
    }
    
    
    
    
    function mostrarIndicadorDeCarga() {
        $('#loadingIndicator').removeClass('d-none');
    }
    function ocultarIndicadorDeCarga() {
        $('#loadingIndicator').addClass('d-none');
    }
});
