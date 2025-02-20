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

// Función para mostrar la card de descanso
function mostrarCardDescanso() {
    document.getElementById('cardDescanso').style.display = 'block';
}

// Función para cerrar la card de descanso
function cerrarCardDescanso() {
    document.getElementById('cardDescanso').style.display = 'none';
}

// Función para mostrar la card de reanudar
function mostrarCardReanudar() {
    document.getElementById('cardReanudar').style.display = 'block';
}

// Función para cerrar la card de reanudar
function cerrarCardReanudar() {
    document.getElementById('cardReanudar').style.display = 'none';
}

// Función para verificar la contraseña y registrar la entrada
function verificarContraseñaEntrada() {
    const inputPassword = document.getElementById('inputPasswordEntrada').value;
    const trabajadores = getTrabajadores();
    const trabajador = trabajadores.find(t => t.contraseña === inputPassword);

    if (trabajador) {
        const fechaHora = new Date();
        const fecha = fechaHora.toISOString().split('T')[0]; // Formato YYYY-MM-DD
        const hora = fechaHora.toTimeString().split(' ')[0]; // Formato HH:MM:SS

        const entrada = {
            id: Date.now(), // Generar ID único basado en la marca de tiempo
            idTrabajador: trabajador.id,
            nombre: trabajador.nombre,
            fecha,
            hora,
            descansos: [],
            salida: null
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

// Función para verificar la contraseña y registrar el descanso
function verificarContraseñaDescanso() {
    const inputPassword = document.getElementById('inputPasswordDescanso').value;
    const trabajadores = getTrabajadores();
    const trabajador = trabajadores.find(t => t.contraseña === inputPassword);

    if (trabajador) {
        const fechaHora = new Date();
        const fecha = fechaHora.toISOString().split('T')[0]; // Formato YYYY-MM-DD
        const hora = fechaHora.toTimeString().split(' ')[0]; // Formato HH:MM:SS

        const entradas = getEntradas();
        const entrada = entradas.find(e => e.idTrabajador === trabajador.id && !e.salida);

        if (entrada) {
            entrada.descansos.push({ inicio: { fecha, hora }, fin: null });
            localStorage.setItem('entradas', JSON.stringify(entradas));

            alert('Descanso registrado correctamente');
            cerrarCardDescanso();
            renderEntradas();
        } else {
            alert('No se encontró una entrada activa.');
        }
    } else {
        alert('Contraseña incorrecta, inténtalo de nuevo.');
    }
}

// Función para verificar la contraseña y reanudar la jornada
function verificarContraseñaReanudar() {
    const inputPassword = document.getElementById('inputPasswordReanudar').value;
    const trabajadores = getTrabajadores();
    const trabajador = trabajadores.find(t => t.contraseña === inputPassword);

    if (trabajador) {
        const fechaHora = new Date();
        const fecha = fechaHora.toISOString().split('T')[0]; // Formato YYYY-MM-DD
        const hora = fechaHora.toTimeString().split(' ')[0]; // Formato HH:MM:SS

        const entradas = getEntradas();
        const entrada = entradas.find(e => e.idTrabajador === trabajador.id && !e.salida);

        if (entrada) {
            const descanso = entrada.descansos.find(d => d.fin === null);
            if (descanso) {
                descanso.fin = { fecha, hora };
                localStorage.setItem('entradas', JSON.stringify(entradas));

                alert('Reanudación registrada correctamente');
                cerrarCardReanudar();
                renderEntradas();
            } else {
                alert('No se encontró un descanso activo.');
            }
        } else {
            alert('No se encontró una entrada activa.');
        }
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
        const descansos = entrada.descansos.map(d => `Inicio: ${d.inicio.fecha} ${d.inicio.hora}, Fin: ${d.fin ? `${d.fin.fecha} ${d.fin.hora}` : 'Pendiente'}`).join('<br>');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entrada.id}</td>
            <td>${entrada.nombre}</td>
            <td>${entrada.fecha}</td>
            <td>${entrada.hora}</td>
            <td>${entrada.salida ? `${entrada.salida.fecha} ${entrada.salida.hora}` : 'Pendiente'}</td>
            <td>${descansos}</td>
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
        document.getElementById('editFecha').value = entrada.fecha; // Formato YYYY-MM-DD
        document.getElementById('editHora').value = entrada.hora; // Formato HH:MM:SS
        if (entrada.salida) {
            document.getElementById('editFechaSalida').value = entrada.salida.fecha;
            document.getElementById('editHoraSalida').value = entrada.salida.hora;
        } else {
            document.getElementById('editFechaSalida').value = '';
            document.getElementById('editHoraSalida').value = '';
        }

        // Renderizar descansos en el formulario
        const descansosContainer = document.getElementById('editDescansosContainer');
        descansosContainer.innerHTML = '';
        entrada.descansos.forEach((descanso, index) => {
            descansosContainer.innerHTML += `
                <h3>Descanso ${index + 1}</h3>
                <label for="editDescansoInicioFecha${index}">Inicio (Fecha):</label>
                <input type="date" id="editDescansoInicioFecha${index}" value="${descanso.inicio.fecha}" required>
                <label for="editDescansoInicioHora${index}">Inicio (Hora):</label>
                <input type="time" id="editDescansoInicioHora${index}" value="${descanso.inicio.hora}" required>
                <label for="editDescansoFinFecha${index}">Fin (Fecha):</label>
                <input type="date" id="editDescansoFinFecha${index}" value="${descanso.fin ? descanso.fin.fecha : ''}">
                <label for="editDescansoFinHora${index}">Fin (Hora):</label>
                <input type="time" id="editDescansoFinHora${index}" value="${descanso.fin ? descanso.fin.hora : ''}">
            `;
        });

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
    const fecha = document.getElementById('editFecha').value; // Formato YYYY-MM-DD
    const hora = document.getElementById('editHora').value;
    const fechaSalida = document.getElementById('editFechaSalida').value || null;
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

        // Actualizar descansos
        entradas[entradaIndex].descansos.forEach((_, index) => {
            const inicioFecha = document.getElementById(`editDescansoInicioFecha${index}`).value;
            const inicioHora = document.getElementById(`editDescansoInicioHora${index}`).value;
            const finFecha = document.getElementById(`editDescansoFinFecha${index}`).value || null;
            const finHora = document.getElementById(`editDescansoFinHora${index}`).value || null;
            entradas[entradaIndex].descansos[index] = {
                inicio: { fecha: inicioFecha, hora: inicioHora },
                fin: finFecha && finHora ? { fecha: finFecha, hora: finHora } : null
            };
        });

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

// Función para exportar los datos a PDF
function exportarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const entradas = getEntradas();
    let y = 10;

    doc.setFontSize(12);
    doc.text("Nombre", 10, y);
    doc.text("Fecha Entrada", 60, y);
    doc.text("Hora Entrada", 100, y);
    doc.text("Fecha Salida", 140, y);
    doc.text("Hora Salida", 180, y);

    y += 10;

    entradas.forEach((entrada) => {
        doc.text(10, y, entrada.nombre);
        doc.text(60, y, entrada.fecha);
        doc.text(100, y, entrada.hora);
        doc.text(140, y, entrada.salida ? entrada.salida.fecha : "Pendiente");
        doc.text(180, y, entrada.salida ? entrada.salida.hora : "Pendiente");
        y += 10;
    });

    doc.save("historial_de_entradas.pdf");
}

// Función para imprimir los datos por rango de fecha
function imprimirRango() {
    const fechaInicio = document.getElementById('fechaInicio').value;
    const fechaFin = document.getElementById('fechaFin').value;

    if (!fechaInicio || !fechaFin) {
        alert("Fechas no válidas. Intente de nuevo.");
        return;
    }

    const entradas = getEntradas();
    const entradasFiltradas = entradas.filter((entrada) => {
        return entrada.fecha >= fechaInicio && entrada.fecha <= fechaFin;
    });

    let popupWin = window.open("", "_blank", "width=800, height=600");
    popupWin.document.open();
    popupWin.document.write(`
        <html>
        <head>
        <title>Imprimir Turnos</title>
        </head>
        <body onload="window.print()">
        <h1>Turnos del ${fechaInicio} al ${fechaFin}</h1>
        <table border="1">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Fecha de Entrada</th>
                    <th>Hora de Entrada</th>
                    <th>Fecha y Hora de Salida</th>
                </tr>
            </thead>
            <tbody>
                ${entradasFiltradas.map((entrada) => `
                    <tr>
                        <td>${entrada.nombre}</td>
                        <td>${entrada.fecha}</td>
                        <td>${entrada.hora}</td>
                        <td>${entrada.salida ? `${entrada.salida.fecha} ${entrada.salida.hora}` : "Pendiente"}</td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
        </body>
        </html>
    `);
    popupWin.document.close();
}

// Llamar a renderEntradas cuando la página se carga
document.addEventListener('DOMContentLoaded', renderEntradas);