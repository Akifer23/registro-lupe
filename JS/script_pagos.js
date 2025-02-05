function regresar() {
    window.location.href = "/index.html";
}

function cargarHistorial() {
    // Recuperar las entradas de localStorage
    const entradas = JSON.parse(localStorage.getItem('entradas')) || [];

    // Crear un objeto para almacenar el total de horas trabajadas y el salario de cada empleado
    const salarios = {};

    entradas.forEach(entrada => {
        if (!salarios[entrada.nombre]) {
            salarios[entrada.nombre] = {
                horasTrabajadas: 0,
                salarioMostrador: 0,
                salarioCaja: 0,
                tarifa: entrada.tarifa,
                pagado: entrada.pagado
            };
        }

        // Calcular las horas trabajadas
        const horaEntrada = new Date(`${entrada.fecha} ${entrada.hora}`);
        const horaSalida = new Date(`${entrada.salida.fecha} ${entrada.salida.hora}`);
        const horasTrabajadas = (horaSalida - horaEntrada) / (1000 * 60 * 60); // Convertir a horas

        salarios[entrada.nombre].horasTrabajadas += horasTrabajadas;

        // Calcular el salario según el rol
        if (entrada.rol === "mostrador") {
            salarios[entrada.nombre].salarioMostrador += horasTrabajadas * entrada.tarifa;
        } else if (entrada.rol === "cajero") {
            salarios[entrada.nombre].salarioCaja += horasTrabajadas * entrada.tarifa;
        }
    });

    // Llenar la tabla con los datos del historial
    const tbody = document.getElementById("historialTableBody");
    tbody.innerHTML = ""; // Limpiar la tabla antes de cargar los datos

    Object.keys(salarios).forEach(nombre => {
        const empleado = salarios[nombre];
        const totalPagar = empleado.salarioMostrador + empleado.salarioCaja;

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${nombre}</td>
            <td>${empleado.horasTrabajadas.toFixed(2)}</td>
            <td>$${empleado.salarioMostrador.toFixed(2)}</td>
            <td>$${empleado.salarioCaja.toFixed(2)}</td>
            <td>$${totalPagar.toFixed(2)}</td>
            <td><button class="pago" disabled>Pagar</button></td>
        `;

        tbody.appendChild(row);
    });
}

// Cargar el historial cuando la página se cargue
window.onload = cargarHistorial;