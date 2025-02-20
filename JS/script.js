function Redireccion_lista2() {
    window.location = "/HTML/Historial_de_entradas.html";
}

function Redireccion_planta() {
    window.location = "/HTML/Registrar_planta.html";
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
    document.getElementById('cardRol').style.display = 'none';
    document.getElementById('cardEntrada').style.display = 'block';
}

function cerrarCardEntrada() {
    document.getElementById('cardEntrada').style.display = 'none';
}

function mostrarCardSalida() {
    document.getElementById('cardSalida').style.display = 'block';
}

function cerrarCardSalida() {
    document.getElementById('cardSalida').style.display = 'none';
}

function mostrarCardDescanso() {
    document.getElementById('cardDescanso').style.display = 'block';
}

function cerrarCardDescanso() {
    document.getElementById('cardDescanso').style.display = 'none';
}

function mostrarCardReanudar() {
    document.getElementById('cardReanudar').style.display = 'block';
}

function cerrarCardReanudar() {
    document.getElementById('cardReanudar').style.display = 'none';
}

function mostrarCardPlanta() {
    document.getElementById('cardPlanta').style.display = 'block';
}

function cerrarCardPlanta() {
    document.getElementById('cardPlanta').style.display = 'none';
}

function limpiarInput(id) {
    document.getElementById(id).value = "";
}

document.getElementById('close-alert').addEventListener('click', function () {
    document.getElementById('custom-alert').style.display = 'none';
    limpiarInput('inputPassword');
    limpiarInput('inputPassword2');
    limpiarInput('inputPasswordEntrada');
    limpiarInput('inputPasswordSalida');
    limpiarInput('inputPasswordDescanso');
    limpiarInput('inputPasswordReanudar');
    limpiarInput('inputPasswordHistorial');
    limpiarInput('inputPasswordPlanta');
});

function VerificarContraseña() {
    const inputPassword = document.getElementById('inputPassword').value;
    const contraseñaCorrecta = '1';

    if (inputPassword === contraseñaCorrecta) {
        window.location = "/HTML/Lista_de_trabajadores.html";
    } else {
        document.getElementById('custom-alert').style.display = 'block';
    }
}

function Contraseña() {
    const inputPassword = document.getElementById('inputPassword2').value;
    const contraseñaCorrecta = '1';

    if (inputPassword === contraseñaCorrecta) {
        window.location = "/HTML/Historial_de_pagos.html";
    } else {
        document.getElementById('custom-alert').style.display = 'block';
    }
}

function getTrabajadores() {
    return JSON.parse(localStorage.getItem('trabajadores')) || [];
}

function getEntradas() {
    return JSON.parse(localStorage.getItem('entradas')) || [];
}

function getTodosLosTrabajadores() {
    const trabajadores = JSON.parse(localStorage.getItem('trabajadores')) || [];
    const trabajadoresPlanta = JSON.parse(localStorage.getItem('trabajadores-planta')) || [];
    return [...trabajadores, ...trabajadoresPlanta];
}

function verificarContraseñaEntrada() {
    const inputPassword = document.getElementById('inputPasswordEntrada').value;
    const trabajadores = getTodosLosTrabajadores();
    const trabajador = trabajadores.find(t => t.contraseña === inputPassword);

    if (trabajador) {
        const rolSelect = document.getElementById('rolSelect');
        const rol = rolSelect.options[rolSelect.selectedIndex].text.split(' ')[0].toLowerCase();
        const fechaHora = new Date();
        const fecha = fechaHora.toLocaleDateString();
        const hora = fechaHora.toLocaleTimeString();

        const entrada = {
            id: Date.now(),
            idTrabajador: trabajador.id,
            nombre: trabajador.nombre,
            fecha,
            hora,
            rol,
            salida: null,
            pagado: false,
            descansos: []
        };

        const entradas = getEntradas();
        entradas.push(entrada);
        localStorage.setItem('entradas', JSON.stringify(entradas));

        alert('Entrada registrada correctamente');
        cerrarCardEntrada();
    } else {
        document.getElementById('custom-alert').style.display = 'block';
    }
}

function verificarContraseñaSalida() {
    const inputPassword = document.getElementById('inputPasswordSalida').value;
    const trabajadores = getTodosLosTrabajadores();
    const trabajador = trabajadores.find(t => t.contraseña === inputPassword);

    if (trabajador) {
        const fechaHora = new Date();
        const fecha = fechaHora.toLocaleDateString();
        const hora = fechaHora.toLocaleTimeString();
        const entradas = getEntradas();
        const entrada = entradas.find(e => e.idTrabajador === trabajador.id && !e.salida);

        if (entrada) {
            entrada.salida = { fecha, hora };
            localStorage.setItem('entradas', JSON.stringify(entradas));

            alert('Salida registrada correctamente');
            cerrarCardSalida();
        } else {
            alert('Este trabajador ya registró su salida.');
        }
    } else {
        document.getElementById('custom-alert').style.display = 'block';
    }
}

function verificarContraseñaDescanso() {
    const inputPassword = document.getElementById('inputPasswordDescanso').value;
    const trabajadores = getTodosLosTrabajadores();
    const trabajador = trabajadores.find(t => t.contraseña === inputPassword);

    if (trabajador) {
        const fechaHora = new Date();
        const fecha = fechaHora.toLocaleDateString();
        const hora = fechaHora.toLocaleTimeString();
        const entradas = getEntradas();
        const entrada = entradas.find(e => e.idTrabajador === trabajador.id && !e.salida);

        if (entrada) {
            entrada.descansos.push({ inicio: { fecha, hora }, fin: null });
            localStorage.setItem('entradas', JSON.stringify(entradas));

            alert('Descanso registrado correctamente');
            cerrarCardDescanso();
        } else {
            alert('Este trabajador ya registró su salida.');
        }
    } else {
        document.getElementById('custom-alert').style.display = 'block';
    }
}

function verificarContraseñaReanudar() {
    const inputPassword = document.getElementById('inputPasswordReanudar').value;
    const trabajadores = getTodosLosTrabajadores();
    const trabajador = trabajadores.find(t => t.contraseña === inputPassword);

    if (trabajador) {
        const fechaHora = new Date();
        const fecha = fechaHora.toLocaleDateString();
        const hora = fechaHora.toLocaleTimeString();
        const entradas = getEntradas();
        const entrada = entradas.find(e => e.idTrabajador === trabajador.id && !e.salida);

        if (entrada) {
            const descanso = entrada.descansos.find(d => d.fin === null);
            if (descanso) {
                descanso.fin = { fecha, hora };
                localStorage.setItem('entradas', JSON.stringify(entradas));

                alert('Reanudación de jornada registrada correctamente');
                cerrarCardReanudar();
            } else {
                alert('No se encontró un descanso en curso para este trabajador.');
            }
        } else {
            alert('Este trabajador ya registró su salida.');
        }
    } else {
        document.getElementById('custom-alert').style.display = 'block';
    }
}

function verificarContraseñaPlanta() {
    const inputPassword = document.getElementById('inputPasswordPlanta').value;
    const contraseñaCorrecta = '1';

    if (inputPassword === contraseñaCorrecta) {
        window.location = "/HTML/Registrar_planta.html";
    } else {
        document.getElementById('custom-alert').style.display = 'block';
    }
}

function mostrarCardContraseñaHistorial() {
    document.getElementById('cardContraseñaHistorial').style.display = 'block';
}

function cerrarCardContraseñaHistorial() {
    document.getElementById('cardContraseñaHistorial').style.display = 'none';
}

function verificarContraseñaHistorial() {
    const inputPassword = document.getElementById('inputPasswordHistorial').value;
    const contraseñaCorrecta = "1";

    if (inputPassword === contraseñaCorrecta) {
        window.location.href = '/HTML/Historial_de_entradas.html';
    } else {
        document.getElementById('custom-alert').style.display = 'block';
    }
}