function cargarHistorial() {
    // Recuperar el historial de pagos de localStorage
    const historialPagos = JSON.parse(localStorage.getItem('historialPagos')) || [];

    // Llenar la tabla con los datos del historial
    const tbody = document.getElementById("historialTableBody");
    tbody.innerHTML = ""; // Limpiar la tabla

    historialPagos.forEach(pago => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${pago.nombre}</td>
            <td>${pago.fecha}</td>
            <td>${pago.horasTrabajadas || 0}</td>
            <td>$${pago.salario || 0}</td>
        `;

        tbody.appendChild(row);
    });
}

// Cargar el historial cuando la página se cargue
window.onload = cargarHistorial;