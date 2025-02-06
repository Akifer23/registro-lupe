function Redireccion_lista2() {
    window.location = "/HTML/Historial_de_entradas.html";
}
function Redireccion_rol() {
    window.location = "/HTML/cambio_de_rol.html";
}
function mostrarCard() {
    document.getElementById('cardContraseña').style.display = 'block';
}

function cerrarCard() {
    document.getElementById('cardContraseña').style.display = 'none';
}
function mostrarCard2() {
    document.getElementById('cardContraseña2').style.display = 'block';
}

function cerrarCard2() {
    document.getElementById('cardContraseña2').style.display = 'none';
}
function mostrarCardRol() {
    document.getElementById('cardRol').style.display = 'block';
}

function continuarConContraseña() {
    // Ocultar la card de rol y mostrar la card de entrada
    document.getElementById('cardRol').style.display = 'none';
    document.getElementById('cardEntrada').style.display = 'block';
}

function cerrarCardEntrada() {
    // Ocultar la card de entrada
    document.getElementById('cardEntrada').style.display = 'none';
}

function mostrarCardSalida() {
    document.getElementById('cardSalida').style.display = 'block';
}

function cerrarCardSalida() {
    document.getElementById('cardSalida').style.display = 'none';
}

function VerificarContraseña() {
    const inputPassword = document.getElementById('inputPassword'); // Referencia al input
    const contraseñaCorrecta = '1';

    if (inputPassword.value === contraseñaCorrecta) {
        // Si la contraseña es correcta, redirigir
        window.location = "/HTML/Lista_de_trabajadores.html";
    } else {
        // Si la contraseña es incorrecta, mostrar el mensaje de error
        document.getElementById('custom-alert').style.display = 'block';

        // Cerrar el mensaje de error y limpiar el campo de contraseña
        document.getElementById('close-alert').addEventListener('click', function () {
            document.getElementById('custom-alert').style.display = 'none';
            inputPassword.value = ""; // Limpiar el campo de contraseña
        });
    }
}
function Contraseña() {
    const inputPassword = document.getElementById('inputPassword2');
    const contraselaCorrecta ='1'
    if (inputPassword ==='Luevano09') {
        alert('contraseña correcta');
        cerrarCard();
        window.location = "/HTML/Historial_de_pagos.html";
        } else {
           // Si la contraseña es incorrecta, mostrar el mensaje de error
        document.getElementById('custom-alert').style.display = 'block';

        // Cerrar el mensaje de error y limpiar el campo de contraseña
        document.getElementById('close-alert').addEventListener('click', function () {
            document.getElementById('custom-alert').style.display = 'none';
            inputPassword.value = ""; // Limpiar el campo de contraseña
        });

    }
}

function getTrabajadores() {
    return JSON.parse(localStorage.getItem('trabajadores')) || [];
}

function getEntradas() {
    return JSON.parse(localStorage.getItem('entradas')) || [];
}

function verificarContraseñaEntrada() {
    const inputPassword = document.getElementById('inputPasswordEntrada');
    const trabajadores = getTrabajadores(); // Obtener todos los trabajadores
    const trabajador = trabajadores.find(t => t.contraseña === inputPassword); // Buscar al trabajador con la contraseña

    if (trabajador) {
        const rolSelect = document.getElementById('rolSelect');
        const tarifa = parseFloat(rolSelect.value);
        const rol = rolSelect.options[rolSelect.selectedIndex].text.split(' ')[0].toLowerCase();

        // Capturar la hora y fecha actual
        const fechaHora = new Date();
        const fecha = fechaHora.toLocaleDateString(); // Fecha en formato local
        const hora = fechaHora.toLocaleTimeString(); // Hora en formato local
        
        // Crear un objeto con la entrada registrada
        const entrada = {
            id: trabajador.id,
            nombre: trabajador.nombre,
            fecha,
            hora,
            rol,
            tarifa,
            salida: null,
            pagado: false
        };

        // Guardar en localStorage
        const entradas = getEntradas();
        entradas.push(entrada);
        localStorage.setItem('entradas', JSON.stringify(entradas));

        alert('Entrada registrada correctamente');
        cerrarCardEntrada(); // Cerrar la card
    } else {
         // Si la contraseña es incorrecta, mostrar el mensaje de error
         document.getElementById('custom-alert').style.display = 'block';

         // Cerrar el mensaje de error y limpiar el campo de contraseña
         document.getElementById('close-alert').addEventListener('click', function () {
             document.getElementById('custom-alert').style.display = 'none';
             inputPassword.value = ""; // Limpiar el campo de contraseña
         });
    }
}

function verificarContraseñaSalida() {
    const inputPassword = document.getElementById('inputPasswordSalida');
    const trabajadores = getTrabajadores(); // Obtener todos los trabajadores
    const trabajador = trabajadores.find(t => t.contraseña === inputPassword); // Buscar al trabajador con la contraseña

    if (trabajador) {
        // Capturar la hora y fecha actual
        const fechaHora = new Date();
        const fecha = fechaHora.toLocaleDateString(); // Fecha en formato local
        const hora = fechaHora.toLocaleTimeString(); // Hora en formato local
        
        // Buscar la entrada de este trabajador para registrar la salida
        const entradas = getEntradas();
        const entrada = entradas.find(e => e.id === trabajador.id && !e.salida); // Verificar que no haya salida aún

        if (entrada) {
            // Actualizar la entrada con la hora de salida
            entrada.salida = {
                fecha,
                hora
            };

            // Guardar las entradas actualizadas
            localStorage.setItem('entradas', JSON.stringify(entradas));

            alert('Salida registrada correctamente');
            cerrarCardSalida(); // Cerrar la card
        } else {
            alert('Este trabajador ya registró su salida.');
        }
    } else {
         // Si la contraseña es incorrecta, mostrar el mensaje de error
         document.getElementById('custom-alert').style.display = 'block';

         // Cerrar el mensaje de error y limpiar el campo de contraseña
         document.getElementById('close-alert').addEventListener('click', function () {
             document.getElementById('custom-alert').style.display = 'none';
             inputPassword.value = ""; // Limpiar el campo de contraseña
         });
    }
}

// Función para mostrar la tarjeta de contraseña del historial
function mostrarCardContraseñaHistorial() {
    const card = document.getElementById('cardContraseñaHistorial');
    card.style.display = 'block';
}

// Función para cerrar la tarjeta de contraseña del historial
function cerrarCardContraseñaHistorial() {
    const card = document.getElementById('cardContraseñaHistorial');
    card.style.display = 'none';
}

// Función para verificar la contraseña del historial
function verificarContraseñaHistorial() {
    const contraseñaIngresada = document.getElementById('inputPasswordHistorial').value;
    const contraseñaCorrecta = "Luevano09"; // Cambia esto por tu contraseña real

    if (contraseñaIngresada === contraseñaCorrecta) {
        // Redirigir al historial de entradas
        window.location.href = '/HTML/Historial_de_entradas.html'; // Cambia la URL según tu estructura
    } else {
         // Si la contraseña es incorrecta, mostrar el mensaje de error
         document.getElementById('custom-alert').style.display = 'block';

         // Cerrar el mensaje de error y limpiar el campo de contraseña
         document.getElementById('close-alert').addEventListener('click', function () {
             document.getElementById('custom-alert').style.display = 'none';
             inputPassword.value = ""; // Limpiar el campo de contraseña
         });
    }
}