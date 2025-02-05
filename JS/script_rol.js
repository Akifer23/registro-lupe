// Función para obtener los trabajadores desde localStorage
function getTrabajadores() {
    return JSON.parse(localStorage.getItem('trabajadores')) || [];
}

// Función para guardar los trabajadores en localStorage
function saveTrabajadores(trabajadores) {
    localStorage.setItem('trabajadores', JSON.stringify(trabajadores));
}

// Función para cargar el perfil del trabajador
function cargarPerfil() {
    const trabajadores = getTrabajadores();
    const nombreSelect = document.getElementById('nombreTrabajador');

    // Limpiar el select antes de agregar opciones
    nombreSelect.innerHTML = '';

    trabajadores.forEach(trabajador => {
        const option = document.createElement('option');
        option.value = trabajador.nombre;
        option.textContent = trabajador.nombre;
        nombreSelect.appendChild(option);
    });

    // Establecer el rol del primer trabajador por defecto
    if (trabajadores.length > 0) {
        document.getElementById('rolTrabajador').value = trabajadores[0].rol;
    }
}

// Función para guardar los cambios de rol
function guardarCambiosRol() {
    const nombreTrabajador = document.getElementById('nombreTrabajador').value;
    const nuevoRol = document.getElementById('rolTrabajador').value;
    const trabajadores = getTrabajadores();
    const trabajador = trabajadores.find(t => t.nombre === nombreTrabajador);

    if (trabajador) {
        trabajador.rol = nuevoRol;
        saveTrabajadores(trabajadores);
        alert(`El rol de ${trabajador.nombre} ha sido cambiado a ${trabajador.rol}.`);
    } else {
        alert("Trabajador no encontrado.");
    }
}

// Llamar a cargarPerfil cuando la página se carga
document.addEventListener('DOMContentLoaded', cargarPerfil);