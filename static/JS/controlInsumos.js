/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */

//Metodo para ver el html de control
function cargarModuloControlInsumos()
{
    fetch('/admin/controlInsumos/controlInsumos.html')
            .then(respuesta => {
                return respuesta.text();
            })
            .then(datos => {
                document.getElementById('contenedor_principal').innerHTML = datos;
            });
}

function registrarInsumoVentana() {    
    // Obtener la ventana modal y los campos de entrada
    const modal = document.getElementById("modal");
    const txtRegistrarNombreInsumo = document.getElementById("txtRegistroNombreInsumo");

    // Limpiar los campos de entrada
    txtRegistrarNombreInsumo.value = "";

    // Mostrar la ventana modal
    modal.style.display = "block";
}
function cerrarVentanaRegistro() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
}


let filaActualInsumo; // Variable global para almacenar la fila actual de insumos
function agregarFilaInsumo() {
    let nombreInsumo = document.getElementById('txtRegistroNombreInsumo').value;

    // Agregar fila a la tabla tbodyRegistroInsumo
    let tbodyInsumo = document.getElementById('tbodyRegistroInsumo');
    let nuevaFilaInsumo = tbodyInsumo.insertRow();
    let cellNombreInsumo = nuevaFilaInsumo.insertCell(0);
    let cellCantidadInsumo = nuevaFilaInsumo.insertCell(1);
    let cellCostoInsumo = nuevaFilaInsumo.insertCell(2);
    let cellDisponibleInsumo = nuevaFilaInsumo.insertCell(3);
    let cellCantidadUtilizadaInsumo = nuevaFilaInsumo.insertCell(4);
    let cellEliminarInsumo = nuevaFilaInsumo.insertCell(5);

    cellNombreInsumo.textContent = nombreInsumo;

    // Crear botón de eliminar
    let botonEliminarInsumo = document.createElement("button");
    botonEliminarInsumo.classList.add("button");
    botonEliminarInsumo.innerHTML = "&#128465;"; // Símbolo de basura

    // Agregar evento click al botón eliminar
    botonEliminarInsumo.addEventListener("click", function (event) {
        eliminarFila(event.target.closest("tr"));
    });

    // Crear input para la cantidad
    let inputCantidadInsumo = document.createElement("input");
    inputCantidadInsumo.type = "number";
    inputCantidadInsumo.classList.add("input"); // Puedes ajustar la clase según tus estilos CSS

    // Crear input para el costo
    let inputCostoInsumo = document.createElement("input");
    inputCostoInsumo.type = "number";
    inputCostoInsumo.classList.add("input"); // Puedes ajustar la clase según tus estilos CSS
    
    // Crear label para mostrar la cantidad (en lugar de un input)
    let labelDisponible = document.createElement("label");
    labelDisponible.textContent = "0"; // Puedes establecer un valor predeterminado si lo deseas
    
    // Crear input para la cantidad utilizada
    let inputCantidadUtilizadaInsumo = document.createElement("input");
    inputCantidadUtilizadaInsumo.type = "number";
    inputCantidadUtilizadaInsumo.classList.add("input"); // Puedes ajustar la clase según tus estilos CSS

    // Agregar elementos al DOM
    cellCantidadInsumo.appendChild(inputCantidadInsumo);
    cellCostoInsumo.appendChild(inputCostoInsumo);
    cellDisponibleInsumo.appendChild(labelDisponible);
    cellCantidadUtilizadaInsumo.appendChild(inputCantidadUtilizadaInsumo);
    cellEliminarInsumo.appendChild(botonEliminarInsumo);

    // Almacenar referencia a la fila actual
    filaActualInsumo = nuevaFilaInsumo;

    // Cerrar ventana modal
    cerrarVentanaRegistro();
}       
function eliminarFila(filaInsumo) {
    let tbodyInsumo = document.getElementById('tbodyRegistroInsumo');
    tbodyInsumo.removeChild(filaInsumo);

    // Obtener el nombre del insumo desde el identificador único
    let nombreInsumo = filaInsumo.cells[0].textContent;

    // Eliminar la fila correspondiente de la tabla tblRegistroInsumosUtilizados
    eliminarFilaUtilizado(nombreInsumo);
}

function guardarInsumoComprado() {
    // Obtener todas las filas de la tabla
    let filasInsumo = document.querySelectorAll("#tbodyRegistroInsumo tr");

    // Iterar sobre cada fila
    filasInsumo.forEach(function (fila) {
        let labelDisponible = fila.cells[3].querySelector("label");

        // Verificar si el labelDisponible se encontró correctamente
        if (!labelDisponible) {
            console.error('No se pudo encontrar el labelDisponible.');
            return;
        }

        let inputCantidadInsumo = fila.cells[1].querySelector("input");
        let inputCantidadUtilizadaInsumo = fila.cells[4].querySelector("input");

        // Verificar si los elementos se encontraron correctamente
        if (!inputCantidadInsumo || !inputCantidadUtilizadaInsumo) {
            console.error('No se pudo encontrar el inputCantidadInsumo o inputCantidadUtilizadaInsumo.');
            return;
        }

        // Convertir los valores a números
        let cantidadInsumo = parseFloat(inputCantidadInsumo.value) || 0;
        let cantidadUtilizada = parseFloat(inputCantidadUtilizadaInsumo.value) || 0;

        // Variable para almacenar la nueva cantidad
        let nuevaCantidad;

        if (inputCantidadUtilizadaInsumo.value === '') {
            // Sumar la cantidad actual con la nueva cantidad
            nuevaCantidad = parseFloat(labelDisponible.textContent) + cantidadInsumo;
        } else if (inputCantidadInsumo.value === '') {
            // Restar la cantidad utilizada
            nuevaCantidad = parseFloat(labelDisponible.textContent) - cantidadUtilizada;

            if (nuevaCantidad < 0) {
                // Mostrar alerta
                Swal.fire({
                    title: 'Error',
                    text: 'No existen suficientes productos.',
                    icon: 'error',
                });
                return; // Detener la iteración si la operación no es válida
            }
        } else {
            // Mostrar error si ambos campos tienen valores
            Swal.fire({
                title: 'Error',
                text: 'Solo puede ingresar Cantidad Utilizada o Cantidad (Kg), no ambos.',
                icon: 'error',
            });
            return;
        }

        // Actualizar el label con la nueva cantidad disponible
        labelDisponible.textContent = nuevaCantidad;

        // Verificar si la cantidad disponible es menor o igual a 10 después de la operación
        if (nuevaCantidad <= 10) {
            // Mostrar alerta
            Swal.fire({
                title: 'Poco producto',
                text: `Queda muy poco producto de ${fila.cells[0].textContent}. ¡Compra más insumo!`,
                icon: 'warning',
                confirmButtonText: 'Entendido'
            });
        }
    });

    // Limpia los datos después de completar todas las operaciones
    limpiarDatos();
}

function limpiarDatos() {
    // Obtener todas las filas de la tabla
    let filasInsumo = document.querySelectorAll("#tbodyRegistroInsumo tr");

    // Iterar sobre cada fila
    filasInsumo.forEach(function (fila) {
        let inputCantidadInsumo = fila.cells[1].querySelector("input");
        let inputCosto = fila.cells[2].querySelector("input");
        let inputCantidadUtilizadaInsumo = fila.cells[4].querySelector("input");

        // Limpiar el contenido de los input
        if (inputCantidadInsumo) {
            inputCantidadInsumo.value = '';
        }
        
        if (inputCosto) {
            inputCosto.value = '';
        }

        if (inputCantidadUtilizadaInsumo) {
            inputCantidadUtilizadaInsumo.value = '';
        }
    });
}

function presionarTeclaInsumo(event) {
    // Verificar si la tecla presionada es 'Enter' (código 13)
    if (event.keyCode === 13) {
        event.preventDefault(); // Evitar el comportamiento por defecto del 'Enter' en un formulario
        agregarFilaInsumo();
    }
}