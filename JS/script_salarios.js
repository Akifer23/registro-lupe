// Función para redirigir a la página principal
function Redireccion_lista() {
    window.location.href = "/index.html";
}

// Función para obtener los trabajadores desde localStorage
function getTrabajadores() {
    return JSON.parse(localStorage.getItem('trabajadores')) || [];
}

// Función para obtener las entradas desde localStorage
function getEntradas() {
    return JSON.parse(localStorage.getItem('entradas')) || [];
}

// Función para obtener el historial de pagos desde localStorage
function getHistorialPagos() {
    return JSON.parse(localStorage.getItem('historialPagos')) || [];
}

// Función para calcular las horas trabajadas
function calcularHorasTrabajadas(entrada) {
    if (!entrada.fecha || !entrada.hora || !entrada.salida || !entrada.salida.fecha || !entrada.salida.hora) {
        console.warn(`Faltan datos de fecha/hora para ${entrada.nombre}, omitiendo.`);
        return 0;
    }

    const fechaEntrada = new Date(`${entrada.fecha}T${entrada.hora}`);
    const fechaSalida = new Date(`${entrada.salida.fecha}T${entrada.salida.hora}`);

    if (isNaN(fechaEntrada.getTime()) || isNaN(fechaSalida.getTime())) {
        console.error(`Fechas inválidas para ${entrada.nombre}, omitiendo.`);
        return 0;
    }

    let horasTrabajadas = (fechaSalida - fechaEntrada) / (1000 * 60 * 60);

    // Restar tiempo de descansos
    if (Array.isArray(entrada.descansos)) {
        entrada.descansos.forEach(descanso => {
            if (descanso.inicio && descanso.fin) {
                const inicioDescanso = new Date(`${descanso.inicio.fecha}T${descanso.inicio.hora}`);
                const finDescanso = new Date(`${descanso.fin.fecha}T${descanso.fin.hora}`);
                if (!isNaN(inicioDescanso.getTime()) && !isNaN(finDescanso.getTime())) {
                    const horasDescanso = (finDescanso - inicioDescanso) / (1000 * 60 * 60);
                    horasTrabajadas -= horasDescanso;
                }
            }
        });
    }

    if (horasTrabajadas < 0) {
        console.warn(`Horas negativas para ${entrada.nombre}, revisa las fechas.`);
        return 0;
    }

    return horasTrabajadas;
}

// Función para cargar los datos en la tabla
function cargarDatos() {
    const trabajadores = getTrabajadores();
    const entradas = getEntradas();
    const historialPagos = getHistorialPagos();

    const entradasNoPagadas = entradas.filter(entrada => !entrada.pagado);
    const salarios = {};

    entradasNoPagadas.forEach(entrada => {
        const trabajador = trabajadores.find(t => t.nombre === entrada.nombre);
        if (!trabajador) {
            console.warn(`Trabajador ${entrada.nombre} no encontrado, omitiendo.`);
            return;
        }

        const tarifa = parseFloat(trabajador.tarifa) || 0;
        const horasTrabajadas = calcularHorasTrabajadas(entrada);

        if (!salarios[entrada.nombre]) {
            salarios[entrada.nombre] = {
                horasTrabajadas: 0,
                salarioTotal: 0,
                tarifa: tarifa
            };
        }

        salarios[entrada.nombre].horasTrabajadas += horasTrabajadas;
        salarios[entrada.nombre].salarioTotal += horasTrabajadas * tarifa;
    });

    // Mostrar los datos en la tabla
    const tbody = document.getElementById("salariosTableBody");
    tbody.innerHTML = "";

    Object.keys(salarios).forEach(nombre => {
        const trabajador = salarios[nombre];
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${nombre}</td>
            <td>${trabajador.horasTrabajadas.toFixed(2)}</td>
            <td>$${trabajador.salarioTotal.toFixed(2)}</td>
            <td><button onclick="marcarComoPagado('${nombre}')">Pagar</button></td>
        `;

        tbody.appendChild(row);
    });
}

// Función para marcar como pagado
function marcarComoPagado(nombre) {
    let entradas = getEntradas();
    const trabajadores = getTrabajadores();
    let historialPagos = getHistorialPagos();

    const pagosRealizados = [];
    entradas = entradas.map(entrada => {
        if (entrada.nombre === nombre && !entrada.pagado) {
            const horasTrabajadas = calcularHorasTrabajadas(entrada);
            const trabajador = trabajadores.find(t => t.nombre === entrada.nombre);
            if (!trabajador) return entrada;

            const tarifa = parseFloat(trabajador.tarifa) || 0;
            const salarioTotal = horasTrabajadas * tarifa;

            pagosRealizados.push({
                nombre: entrada.nombre,
                fecha: entrada.fecha,
                horasTrabajadas: horasTrabajadas.toFixed(2),
                salario: salarioTotal.toFixed(2)
            });

            return { ...entrada, pagado: true };
        }
        return entrada;
    });

    historialPagos.push(...pagosRealizados);
    localStorage.setItem('entradas', JSON.stringify(entradas));
    localStorage.setItem('historialPagos', JSON.stringify(historialPagos));

    cargarDatos();
}

// Función para ver el historial de pagos
function verHistorial() {
    const historialPagos = getHistorialPagos();

    let historialHTML = `<h2>Historial de Pagos</h2>`;
    if (historialPagos.length === 0) {
        historialHTML += `<p>No hay pagos registrados.</p>`;
    } else {
        historialHTML += `<table border="1">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Fecha</th>
                    <th>Horas Trabajadas</th>
                    <th>Salario</th>
                </tr>
            </thead>
            <tbody>`;

        historialPagos.forEach(pago => {
            historialHTML += `
                <tr>
                    <td>${pago.nombre}</td>
                    <td>${pago.fecha}</td>
                    <td>${pago.horasTrabajadas}</td>
                    <td>$${pago.salario}</td>
                </tr>
            `;
        });

        historialHTML += `</tbody></table>`;
    }

    // Mostrar en un modal o en la página
    const historialContainer = document.getElementById("historialContainer");
    if (historialContainer) {
        historialContainer.innerHTML = historialHTML;
        historialContainer.style.display = "block"; // Mostrar el contenedor
    } else {
        alert("Revisa la consola para ver el historial de pagos.");
        console.log("Historial de pagos:", historialPagos);
    }
}

// Cargar datos al iniciar la página
window.onload = cargarDatos;