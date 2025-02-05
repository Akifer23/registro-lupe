let entradaActualId = null;

function Redireccion_lista() {
    window.location = "/index.html";
}

// Función para obtener los trabajadores desde localStorage
function getTrabajadores() {
    return JSON.parse(localStorage.getItem('trabajadores')) || [];
}

// Función para obtener las entradas desde localStorage
function getEntradas() {
    return JSON.parse(localStorage.getItem('entradas')) || [];
}

// Función para mostrar la card de entrada
function mostrarCardEntrada() {
    document.getElementById('cardEntrada').style.display = 'block';
}

// Función para cerrar la card de entrada
function cerrarCardEntrada() {
    document.getElementById('cardEntrada').style.display = 'none';
}

// Función para verificar la contraseña y registrar la entrada
function verificarContraseñaEntrada() {
    const inputPassword = document.getElementById('inputPasswordEntrada').value;
    const trabajadores = getTrabajadores(); 
    const trabajador = trabajadores.find(t => t.contraseña === inputPassword); 

    if (trabajador) {
        const fechaHora = new Date();
        const fecha = fechaHora.toLocaleDateString(); 
        const hora = fechaHora.toLocaleTimeString(); 
        
        const entrada = {
            id: trabajador.id,
            nombre: trabajador.nombre,
            fecha,
            hora
        };

        const entradas = getEntradas();
        entradas.push(entrada);
        localStorage.setItem('entradas', JSON.stringify(entradas));

        alert('Entrada registrada correctamente');
        cerrarCardEntrada(); 
        renderEntradas();
    } else {
        alert('Contraseña incorrecta, inténtalo de nuevo.');
    }
}

// Función para renderizar las entradas en la tabla
function renderEntradas() {
    const entradas = getEntradas();
    const tableBody = document.getElementById('entradasTableBody');
    tableBody.innerHTML = ''; 

    entradas.forEach(entrada => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entrada.id}</td>
            <td>${entrada.nombre}</td>
            <td>${entrada.fecha}</td>
            <td>${entrada.hora}</td>
            <td>${entrada.salida ? `${entrada.salida.fecha} ${entrada.salida.hora}` : 'Pendiente'}</td>
            <td>
                <button onclick="mostrarCardEditar(${entrada.id})">Modificar</button>
                <button onclick="eliminarRegistro(${entrada.id})">Eliminar</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Función para mostrar la card de edición
function mostrarCardEditar(id) {
    const entradas = getEntradas();
    const entrada = entradas.find(e => e.id === id);

    if (entrada) {
        entradaActualId = id;
        document.getElementById('editNombre').value = entrada.nombre;
        document.getElementById('editFecha').value = entrada.fecha.split('/').reverse().join('-'); // Convertir a formato yyyy-mm-dd
        document.getElementById('editHora').value = entrada.hora;
        if (entrada.salida) {
            document.getElementById('editFechaSalida').value = entrada.salida.fecha.split('/').reverse().join('-'); // Convertir a formato yyyy-mm-dd
            document.getElementById('editHoraSalida').value = entrada.salida.hora;
        } else {
            document.getElementById('editFechaSalida').value = '';
            document.getElementById('editHoraSalida').value = '';
        }
        document.getElementById('cardEditar').style.display = 'block';
    }
}

// Función para cerrar la card de edición
function cerrarCardEditar() {
    document.getElementById('cardEditar').style.display = 'none';
}

// Función para guardar los cambios
function guardarCambios() {
    const nombre = document.getElementById('editNombre').value;
    const fecha = document.getElementById('editFecha').value.split('-').reverse().join('/'); // Convertir a formato dd/mm/yyyy
    const hora = document.getElementById('editHora').value;
    const fechaSalida = document.getElementById('editFechaSalida').value ? document.getElementById('editFechaSalida').value.split('-').reverse().join('/') : null; // Convertir a formato dd/mm/yyyy
    const horaSalida = document.getElementById('editHoraSalida').value || null;

    const entradas = getEntradas();
    const entradaIndex = entradas.findIndex(e => e.id === entradaActualId);

    if (entradaIndex !== -1) {
        entradas[entradaIndex].nombre = nombre;
        entradas[entradaIndex].fecha = fecha;
        entradas[entradaIndex].hora = hora;
        if (fechaSalida && horaSalida) {
            entradas[entradaIndex].salida = {
                fecha: fechaSalida,
                hora: horaSalida
            };
        } else {
            delete entradas[entradaIndex].salida;
        }
        localStorage.setItem('entradas', JSON.stringify(entradas));
        renderEntradas();
        cerrarCardEditar();
    }
}

// Función para eliminar un registro
function eliminarRegistro(id) {
    const entradas = getEntradas();
    const nuevasEntradas = entradas.filter(e => e.id !== id);
    localStorage.setItem('entradas', JSON.stringify(nuevasEntradas));
    renderEntradas();
}

// Llamar a renderEntradas cuando la página se carga
document.addEventListener('DOMContentLoaded', renderEntradas);