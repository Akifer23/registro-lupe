// Redirección
function Redireccion_lista() {
    window.location.href = "/index.html";
}

// Obtener trabajadores desde localStorage
function getTrabajadores() {
    return JSON.parse(localStorage.getItem('trabajadores-planta')) || [];
}

// Guardar trabajadores en localStorage
function setTrabajadores(trabajadores) {
    localStorage.setItem('trabajadores-planta', JSON.stringify(trabajadores));
}

// Renderizar la tabla de trabajadores
function renderTrabajadores() {
    const trabajadores = getTrabajadores();
    const tableBody = document.querySelector('#trabajadoresTable tbody');
    tableBody.innerHTML = '';

    trabajadores.forEach(trabajador => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${trabajador.id}</td>
            <td>${trabajador.nombre}</td>
            <td>${trabajador.pago}</td>
            <td>$${trabajador.tarifa}</td>
            <td>${trabajador.contraseña}</td>
            <td>${trabajador.horarioEntrada}</td>
            <td>${trabajador.horarioSalida}</td>
            <td>
                <button onclick="editarTrabajador(${trabajador.id})">Editar</button>
                <button onclick="eliminarTrabajador(${trabajador.id})">Eliminar</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Agregar un nuevo trabajador
document.getElementById('trabajadores-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const pago = document.getElementById('pago').value;
    const tarifa = parseFloat(document.getElementById('tarifa').value);
    const contraseña = document.getElementById('contraseña').value;
    const horarioEntrada = document.getElementById('horaEntrada').value;
    const horarioSalida = document.getElementById('horaSalida').value;

    const trabajador = {
        id: Date.now(), // Identificador único
        nombre,
        pago,
        tarifa,
        contraseña,
        horarioEntrada,
        horarioSalida
    };

    const trabajadores = getTrabajadores();
    trabajadores.push(trabajador);
    setTrabajadores(trabajadores);

    alert('Trabajador agregado correctamente');
    renderTrabajadores();
    document.getElementById('trabajadores-form').reset(); // Limpiar el formulario
});

// Eliminar un trabajador
function eliminarTrabajador(id) {
    const trabajadores = getTrabajadores();
    const nuevosTrabajadores = trabajadores.filter(t => t.id !== id);
    setTrabajadores(nuevosTrabajadores);
    renderTrabajadores();
}

// Editar un trabajador (puedes implementar esta función si es necesario)
function editarTrabajador(id) {
    const trabajadores = getTrabajadores();
    const trabajador = trabajadores.find(t => t.id === id);
    if (trabajador) {
        // Llenar el formulario con los datos del trabajador
        document.getElementById('nombre').value = trabajador.nombre;
        document.getElementById('pago').value = trabajador.pago;
        document.getElementById('tarifa').value = trabajador.tarifa;
        document.getElementById('contraseña').value = trabajador.contraseña;
        document.getElementById('horaEntrada').value = trabajador.horarioEntrada;
        document.getElementById('horaSalida').value = trabajador.horarioSalida;

        // Eliminar el trabajador de la lista para actualizarlo
        eliminarTrabajador(id);
    }
}

// Cargar la tabla al iniciar la página
document.addEventListener('DOMContentLoaded', renderTrabajadores);