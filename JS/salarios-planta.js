function calcularSalarioPlanta() {
    const trabajadoresPlanta = JSON.parse(localStorage.getItem('trabajadores-planta')) || [];
    const entradas = JSON.parse(localStorage.getItem('entradas')) || [];
    
    const tbody = document.getElementById("salariosTableBody");
    tbody.innerHTML = "";
    
    trabajadoresPlanta.forEach(trabajador => {
        const { nombre, tarifa, horarioEntrada, horarioSalida } = trabajador;
        const tarifaHora = parseFloat(tarifa) || 0;
        
        const entrada = entradas.find(e => e.nombre === nombre);
        
        if (!entrada || !entrada.salida) {
            console.warn(`No hay registro de entrada/salida para ${nombre}.`);
            return;
        }
        
        const fechaEntrada = new Date(`${entrada.fecha} ${entrada.hora}`);
        const fechaSalida = new Date(`${entrada.salida.fecha} ${entrada.salida.hora}`);
        
        const horarioEntradaEsperado = new Date(`${entrada.fecha} ${horarioEntrada}`);
        const horarioSalidaEsperado = new Date(`${entrada.fecha} ${horarioSalida}`);
        
        if (isNaN(fechaEntrada.getTime()) || isNaN(fechaSalida.getTime())) {
            console.error(`Fechas inválidas para ${nombre}, omitiendo.`);
            return;
        }
        
        const horasTrabajadas = (fechaSalida - fechaEntrada) / (1000 * 60 * 60);
        const horasEsperadas = (horarioSalidaEsperado - horarioEntradaEsperado) / (1000 * 60 * 60);
        
        const horasFaltantes = Math.max(0, horasEsperadas - horasTrabajadas);
        const salarioTotal = horasTrabajadas * tarifaHora;
        
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${nombre}</td>
            <td>${horasTrabajadas.toFixed(2)}</td>
            <td>${horasFaltantes.toFixed(2)}</td>
            <td>$${salarioTotal.toFixed(2)}</td>
        `;
        tbody.appendChild(row);
    });
}

document.addEventListener("DOMContentLoaded", calcularSalarioPlanta);
