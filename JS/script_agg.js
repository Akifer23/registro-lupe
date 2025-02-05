function Redireccion_lista() {
    window.location = "/index.html";
}

// Función para obtener los trabajadores desde localStorage
function getTrabajadores() {
    return JSON.parse(localStorage.getItem('trabajadores')) || [];
}

// Función para guardar los trabajadores en localStorage
function saveTrabajadores(trabajadores) {
    if (Array.isArray(trabajadores)) {
        localStorage.setItem('trabajadores', JSON.stringify(trabajadores));
    } else {
        console.error('Intentando guardar un valor inválido');
    }
}

// Función para renderizar la tabla de trabajadores
function renderTable() {
    const trabajadores = getTrabajadores();
    const tableBody = document.querySelector('#trabajadoresTable tbody');
    tableBody.innerHTML = '';

    trabajadores.forEach(trabajador => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${trabajador.id}</td>
            <td>${trabajador.nombre}</td>
            <td>${trabajador.diaPago}</td>
            <td>${trabajador.contraseña}</td>
            <td>
                <button onclick="deleteTrabajador(${trabajador.id})">Eliminar</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Función para inicializar el formulario y la tabla
document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('trabajadores')) {
        localStorage.setItem('trabajadores', JSON.stringify([]));
    }

    const form = document.getElementById('trabajadores-form');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const diaPago = document.getElementById('pago').value;
        const contraseña = document.getElementById('contraseña').value;

        if (contraseña.length !== 10) {
            alert('La contraseña debe tener 10 caracteres');
            return;
        }

        const trabajadores = getTrabajadores();
        const id = trabajadores.length > 0 ? trabajadores[trabajadores.length - 1].id + 1 : 1;

        const nuevoTrabajador = { id, nombre, diaPago, contraseña };
        trabajadores.push(nuevoTrabajador);
        saveTrabajadores(trabajadores);
        renderTable();
        form.reset();
    });

    renderTable();
});

// Función para eliminar un trabajador
function deleteTrabajador(id) {
    const trabajadores = getTrabajadores();
    const nuevosTrabajadores = trabajadores.filter(trabajador => trabajador.id !== id);
    saveTrabajadores(nuevosTrabajadores);
    renderTable();
}