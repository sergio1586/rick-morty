$(document).ready(() => {
    var usuarioGuardado;//variable para almacenar el usuario

    Swal.fire({//alert inicial
        title: 'Introduce tu nombre',
        input: 'text',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        preConfirm: (usuario) => {
            usuarioGuardado = usuario;
        }
    }).then((result) => {
        if (result.isConfirmed) {
            if (usuarioGuardado !== undefined) {
                if(usuarioGuardado==''){
                    Swal.fire({//alert si el campo vacio
                        position: "center",
                        icon: "error",
                        title: "El campo esta vacio",
                        showConfirmButton: false,
                        timer: 1500
                        });
                }else{//alert si contiene nombre
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Nombre guardado",
                        showConfirmButton: false,
                        timer: 1500
                        });
                }
            } else {//alert si campo vacio
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "El campo esta vacio",
                    showConfirmButton: false,
                    timer: 1500
                    });
            }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire({//si se cancela el modal primero
                position: "center",
                icon: "error",
                title: "Operacion cancelada",
                showConfirmButton: false,
                timer: 1500
                });
        }
    });
    $('#obtener').on('click', function () {//evento cuando se pulsa el boton
        mostrarIndicadorDeCarga();
        obtenerPersonajes();
    });
    //funcion para hacer la peticion
    function obtenerPersonajes() {
        $.ajax({
            url: '/datos',
            type: 'POST',
            dataType: 'json',
            data: { seleccion: select.val() },
            success: function (data) {
                personajesArray=data;
                ocultarIndicadorDeCarga();
                mostrarPersonajes(data);
            },
            error: function (error) {
                ocultarIndicadorDeCarga();
                console.error('Error al obtener personajes', error.responseText);
            }
        });
    }
    //funcion para renderizar los personajes
    function mostrarPersonajes(personajes) {
        const contenedorPersonajes = $('#listaPersonajes');
        contenedorPersonajes.html('');
    
        $.each(personajes, function(index, personaje) {
            const divCartaSuperior=$('<div>').addClass('img-container card mb-4 col-12 col-sm-3 bg-secondary');
            const divCarta = $('<div>').addClass(' bg-secondary img-hover');
            const imagenPersona = $('<img>').addClass('card-img-top');
            imagenPersona.attr('src', personaje.image);
            const divCuerpo = $('<div>').addClass('card-body text-white');
            const nombre = $('<h5>').addClass('card-title').text(personaje.name);
            let estado;
            let genero;
            if(personaje.status=='Dead'){
                estado='#CC3300';
            }else if(personaje.status=='Alive'){
                estado='#66CC00';
            }else{
                estado='#999999'
            }
            if(personaje.gender=='Male'){
                genero='Masculino';
            }else if(personaje.gender=='Female'){
                genero='Femenino';
            }else{
                genero='Desconocido';
            }
            const estadoCirculo = $('<div>').addClass('estado-circulo');
            estadoCirculo.css('background-color', estado);
                const infoAdicional = $('<p>').addClass('card-text').html(`
                    <strong>Especie:</strong> ${personaje.species}<br>
                    <strong>Estado:</strong> ${estadoCirculo.prop('outerHTML')}<br>
                    <strong>Genero</strong> ${genero}<br>
                    <strong>Ubicación:</strong> ${personaje.location.name}
                `);
            divCuerpo.append(imagenPersona, nombre, infoAdicional);
            divCarta.append(divCuerpo);
            divCartaSuperior.append(divCarta);
            contenedorPersonajes.append(divCartaSuperior);
        });
    }
    $('#aplicaFiltro').on('click', function () {//evento que aplica los filtros selecionados
        if(personajesArray===undefined){
            Swal.fire({
                icon: "error",
                title: "Sin Datos",
                text: "Seleccione una pagina para obtener datos",
            });
        }else{
            console.log('Aplicando filtros...');
            mostrarIndicadorDeCarga();
            aplicarFiltros();
        }
        
    });

    function aplicarFiltros(){//funcion que aplica los filtros
        var filtroMasculino=$('#filtroMasculino').is(':checked');
        var filtroFemenino=$('#filtroFemenino').is(':checked');
        var filtroVivo=$('#filtroVivo').is(':checked');
        var filtroMuerto=$('#filtroMuerto').is(':checked');

        var personajesFiltrados=personajesArray.filter(function(personaje){
            return (!filtroMasculino || personaje.gender === 'Male') &&
                    (!filtroFemenino || personaje.gender === 'Female') &&
                    (!filtroVivo || personaje.status === 'Alive') &&
                    (!filtroMuerto || personaje.status === 'Dead');
        })
        ocultarIndicadorDeCarga();
        mostrarPersonajes(personajesFiltrados);
    }
    function mostrarIndicadorDeCarga() {//funcion para mostrar el spinner
        $('#loadingIndicator').removeClass('d-none');
    }
    function ocultarIndicadorDeCarga() {//funcion para ocultar el spinner
        $('#loadingIndicator').addClass('d-none');
    }
});
