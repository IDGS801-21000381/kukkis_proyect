/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */
let ventas = [];
//Metodo para ver el html de ventas
function cargarModuloVentas() {
    fetch('/admin/ventas/ventas.js') // Ruta relativa a la ubicación del archivo HTML
        .then(respuesta => {
            return respuesta.text();
        })
        .then(datos => {
            document.getElementById('contenedor_principal').innerHTML = datos;
        });
}
function cargarContenido(categoria) {
    let ruta;

    switch (categoria) {
        case 'pieza':
            ruta = '/Don_Galleto/admin/ventas/VentaPieza.html';
            break;
        case 'peso':
            ruta = '/Don_Galleto/admin/ventas/VentaPeso.html';
            break;
        case 'cantidad':
            ruta = '/Don_Galleto/admin/ventas/VentaCantidad.html';
            break;
        case 'caja':
            ruta = '/Don_Galleto/admin/ventas/VentaCaja.html';
            break;
        default:
            console.error('Categoría no reconocida');
            return;
    }

    fetch(ruta)
        .then(respuesta => {
            if (!respuesta.ok) {
                throw new Error(`No se pudo cargar el archivo. Código de estado: ${respuesta.status}`);
            }
            return respuesta.text();
        })
        .then(datos => {
            document.getElementById('contenedor_tabla').innerHTML = datos;
        })
        .catch(error => {
            console.error('Error al cargar el archivo:', error);
        });
}

function mostrarInfo(nombre, precio) {
    // Actualiza el contenido de las etiquetas con la información de la fruta
    document.getElementById('txtNombreNombre').textContent = nombre;
    document.getElementById('txtPrecio').textContent = precio;
}

function calcularTotalPieza() {
    // Obtener los elementos del DOM
    let precioElementText = document.getElementById('txtPrecio').textContent;
    let cantidadElement = document.getElementById('txtCantidadPieza');
    let totalElement = document.getElementById('txtTotalPieza');
    let btnAgregarVenta = document.getElementById('btnAgregarVenta');

    // Convertir el valor del precio a un número
    let precio = parseFloat(precioElementText) || 0;
    let cantidad = parseInt(cantidadElement.value) || 0;

    // Calcular el total
    let total = precio * cantidad;
    
    if (precioElementText === '') {
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: 'Selecione un tipo de Galleta.',
        });
        btnAgregarVenta.disabled = true; // Desactivar el botón
        return;
    }
    // Mostrar alerta si la cantidad es 0 y el total es 0.00
    if (cantidad === 0 && total === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: 'La cantidad de galletas no puede ser 0. Ingresa un número mayor o igual a 1.',
        });
        btnAgregarVenta.disabled = true; // Desactivar el botón
        return;
    }

    // Actualizar el contenido del label con el total calculado
    totalElement.textContent = total.toFixed(2); // Redondear a dos decimales
    btnAgregarVenta.disabled = false;
}

function validarCantidad() {
    let cantidadInput = document.getElementById('txtCantidadPieza');
    let totalLabel = document.getElementById('txtTotalPieza');
    let btnAgregarVenta = document.getElementById('btnAgregarVenta');

    cantidadInput.value = cantidadInput.value.replace(/[^0-9]/g, ''); // Eliminar caracteres no numéricos


    // Habilitar o deshabilitar el botón de agregar según si el campo de total tiene datos
    btnAgregarVenta.disabled = isNaN(parseFloat(totalLabel.textContent.trim()));
    calcularTotalPieza();
}
function presionarTecla(event) {
    // Verificar si la tecla presionada es 'Enter' (código 13)
    if (event.keyCode === 13) {
        event.preventDefault(); // Evitar el comportamiento por defecto del 'Enter' en un formulario
        calcularTotalPieza();
    }
}

let contador = 1;

function agregarFila() {  
    let nombreGalleta = document.getElementById('txtNombreNombre').innerText;
    let tipoVenta = obtenerTipoVenta();
    let cantidad = document.getElementById('txtCantidadPieza').value;
    let precio = parseFloat(document.getElementById('txtPrecio').innerText); // Modificación aquí
    let fecha = obtenerFecha();
    let subtotal = parseFloat(precio) * parseFloat(cantidad); // Modificación aquí
    let btnAgregarVenta = document.getElementById('btnAgregarVenta');
    let totalElement = document.getElementById('txtTotalPieza');
    
    if (cantidad === '' || cantidad === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: 'Ingrese la cantidad de Galletas',
        });
        btnAgregarVenta.disabled = true; // Desactivar el botón
        return;
    }
    totalElement.textContent = subtotal.toFixed(2);
    if (cantidad === 0 || subtotal === 0.00) {
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: 'La cantidad de galletas no puede ser 0. Escriba un número mayor a 1.',
        });
        btnAgregarVenta.disabled = true; // Desactivar el botón
        return;
    }
    
    // Agregar fila a la tabla
    let tbody = document.getElementById('tbodyTicket');
    let nuevaFila = tbody.insertRow();
    let cellNum = nuevaFila.insertCell(0);
    let cellNombre = nuevaFila.insertCell(1);
    let cellTipoVenta = nuevaFila.insertCell(2);
    let cellCantidad = nuevaFila.insertCell(3);
    let cellFecha = nuevaFila.insertCell(4);
    let cellSubtotal = nuevaFila.insertCell(5);
    let cellEliminar = nuevaFila.insertCell(6); // Agregamos la nueva celda para el botón Eliminar

    cellNum.textContent = contador++;
    cellNombre.textContent = nombreGalleta;
    cellTipoVenta.textContent = tipoVenta;
    cellCantidad.textContent = cantidad + " Galletas";
    cellFecha.textContent = fecha;
    cellSubtotal.textContent = subtotal.toFixed(2);

    // Crear botón de eliminar
    let botonEliminar = document.createElement("button");
    botonEliminar.classList.add("button"); // Puedes ajustar la clase según tus estilos CSS
    botonEliminar.innerHTML = "&#128465;"; // Símbolo de basura

    // Agregar evento click al botón eliminar
    botonEliminar.addEventListener("click", function() {
        eliminarFilaPieza(nuevaFila);
    });

    // Agregar el botón al cellEliminar
    cellEliminar.appendChild(botonEliminar);

    // Recalcular el total después de agregar cada fila
    agregarFilaTotal();
}
// Función para eliminar una fila específica
function eliminarFilaPieza(fila) {
    let tbody = document.getElementById('tbodyTicket');
    tbody.removeChild(fila);

    // Recalcular el total después de eliminar la fila
    agregarFilaTotal();
}
function agregarFilaTotal() {
    let tbody = document.getElementById('tbodyTicket');

    // Eliminar filas anteriores de total si existen
    let totalRows = document.getElementsByClassName('total-row');
    for (let i = 0; i < totalRows.length; i++) {
        tbody.removeChild(totalRows[0]); // Utilizar [0] para siempre eliminar la primera fila de total
    }

    // Calcular y agregar la fila de total
    let totalRow = tbody.insertRow();
    totalRow.classList.add('total-row'); // Agregar clase para identificar filas de total
    let cellTotalLabel = totalRow.insertCell(0);
    let cellTotalValue = totalRow.insertCell(1);

    cellTotalLabel.textContent = 'Total:';
    cellTotalLabel.colSpan = 5; // Span del texto 'Total' para ocupar las primeras 5 columnas
    cellTotalValue.textContent = calcularTotal().toFixed(2);
    console.log(cellTotalValue);
}
function calcularTotal() {
    let tbody = document.getElementById('tbodyTicket');
    let rows = tbody.getElementsByTagName('tr');
    let total = 0;

    // Recorrer las filas y sumar los subtotales
    for (let i = 0; i < rows.length; i++) {
        let cells = rows[i].getElementsByTagName('td');

        // Asegurarse de que haya suficientes celdas antes de acceder a cells[5]
        if (cells.length >= 6) {  // Asegurarse de que hay al menos 6 celdas (0-5)
            total += parseFloat(cells[5].textContent);
        }
    }

    return total;
}
function obtenerTipoVenta() {
    let tipoVenta = '';
    
    // Obtener los elementos de radio
    let radioPieza = document.getElementById('pieza');
    let radioPeso = document.getElementById('peso');
    let radioCantidad = document.getElementById('cantidad');
    let radioCaja = document.getElementById('caja');
    
    // Verificar cuál radio está seleccionado y asignar el tipo correspondiente
    if (radioPieza.checked) {
        tipoVenta = 'Pieza';
    } else if (radioPeso.checked) {
        tipoVenta = 'Peso (g)';
    } else if (radioCantidad.checked) {
        tipoVenta = 'Cantidad';
    } else if (radioCaja.checked) {
        tipoVenta = 'Caja';
    }

    return tipoVenta;
}
function obtenerFecha() {
    // Lógica para obtener la fecha (zona horaria México)
    let options = { timeZone: 'America/Mexico_City' };
    let fechaActual = new Date().toLocaleString('es-MX', options);
    return fechaActual;
}
function guardarVenta() {
    Swal.fire({
        title: 'Venta guardada correctamente.',
        text: '¿Desea imprimir el Ticket?',
        showCancelButton: true,
        confirmButtonText: 'Sí, Imprimir Ticket',
        cancelButtonText: 'No',
        reverseButtons: true,
    }).then((result) => {
        if (result.isConfirmed) {
            imprimirTicket();
        } else {
            // Código para realizar acciones cuando el usuario elige "No"
            Swal.fire('Venta guardada', 'La venta ha sido guardada sin imprimir el Ticket.', 'info');
        }
    });
}

function imprimirTicket() {
    
    var nombreArchivo = "Ticket"+".pdf";

    var contenido = document.getElementById("contenidoTicket").cloneNode(true);
    var elementosNoDeseados = contenido.querySelectorAll("script, button, input, label, select");

    elementosNoDeseados.forEach(function (elemento) {
        elemento.parentNode.removeChild(elemento);
    });

    var ventanaImpresion = window.open("", "_blank", "width=1000,height=800");
    var estilos = document.getElementsByTagName("style");
    for (var i = 0; i < estilos.length; i++) {
        ventanaImpresion.document.write(estilos[i].outerHTML);
    }

    var enlacesEstilo = document.querySelectorAll("link[rel='stylesheet']");
    for (var i = 0; i < enlacesEstilo.length; i++) {
        ventanaImpresion.document.write(enlacesEstilo[i].outerHTML);
    }
    ventanaImpresion.document.open();
    ventanaImpresion.document.write('<html><head><title>' + nombreArchivo + '</title></head><body>');
    ventanaImpresion.document.write('<h1>Don Galleto</h1>');
    ventanaImpresion.document.write(contenido.innerHTML);
    ventanaImpresion.document.write('</body></html>');
    ventanaImpresion.document.close();
    ventanaImpresion.print();

}

function calcularTotalPeso() {
    // Obtener los elementos del DOM
    let precioElementText = document.getElementById('txtPrecio').textContent;
    let cantidadElement = document.getElementById('txtCantidadPeso');
    let totalElement = document.getElementById('txtTotalPeso');
    let cantidadGalletasElement = document.getElementById('txtCantidadGalletasPeso');
    let pesoGalleta = 20;
    let btnAgregarVenta = document.getElementById('btnAgregarVentaPeso');

    // Convertir el valor del precio a un número
    let precio = parseFloat(precioElementText) || 0;
    // Convertir la cantidad de galletas a un número
    let cantidad = parseFloat(cantidadElement.value) || 0;

    // Mostrar alerta si el tipo de galleta no está seleccionado
    if (precioElementText === '') {
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: 'Seleccione un tipo de Galleta.',
        });
        btnAgregarVenta.disabled = true; // Desactivar el botón
        return;
    }

    // Mostrar alerta si la cantidad en gramos no es válida
    if (cantidad.length > 2 && cantidad < 20) {
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: 'La cantidad en gramos no es válida. Ingrese un número mayor o igual a 20.',
        });
        btnAgregarVenta.disabled = true; // Desactivar el botón
        return;
    }

    // Calcular la cantidad de galletas
    const cantidadGalletas = Math.ceil(cantidad / pesoGalleta); // Redondear hacia arriba

    // Calcular el total a cobrar
    const totalDinero = cantidadGalletas * precio;

    // Actualizar el contenido del label con el total en gramos
    totalElement.textContent = totalDinero.toFixed(2); // Redondear a dos decimales

    // Mostrar la cantidad de galletas
    cantidadGalletasElement.textContent = cantidadGalletas;

    // Activar el botón de agregar
    btnAgregarVenta.disabled = false;

    return totalDinero.toFixed(2);
}
function validarCantidadPeso() {
    let cantidadInput = document.getElementById('txtCantidadPeso');
    let totalLabel = document.getElementById('txtTotalPeso');
    let btnAgregarVenta = document.getElementById('btnAgregarVentaPeso');

    cantidadInput.value = cantidadInput.value.replace(/[^0-9]/g, ''); // Eliminar caracteres no numéricos

    // Habilitar o deshabilitar el botón de agregar según si el campo de total tiene datos
    btnAgregarVenta.disabled = isNaN(parseFloat(totalLabel.textContent.trim()));
    calcularTotalPeso();
}

function presionarTeclaPeso(event) {
    // Verificar si la tecla presionada es 'Enter' (código 13)
    if (event.keyCode === 13) {
        event.preventDefault(); // Evitar el comportamiento por defecto del 'Enter' en un formulario
        calcularTotalPeso();
    }
}
function agregarFilaPeso() {  
    let nombreGalleta = document.getElementById('txtNombreNombre').innerText;
let tipoVenta = obtenerTipoVenta();
let cantidad = parseFloat(document.getElementById('txtCantidadPeso').value);
let precio = parseFloat(document.getElementById('txtPrecio').innerText);
let fecha = obtenerFecha();
let CantidadGalletas = parseFloat(document.getElementById('txtCantidadGalletasPeso').innerText);
let subtotal = precio * CantidadGalletas;
let btnAgregarVenta = document.getElementById('btnAgregarVentaPeso');


    // Verificar si la cantidad es un número válido
    if (isNaN(cantidad) || cantidad === '' || cantidad < 20) {
    Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'Ingrese una cantidad de Galletas en gramos válida (mayor o igual a 20).',
    });
    btnAgregarVenta.disabled = true; // Desactivar el botón
    return;
}


    // Verificar si la cantidad es menor que 20 o el subtotal es 0.00
    if (cantidad < 20 || subtotal <= 0.00) {
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: 'La cantidad en gramos no es válida. Ingrese un número mayor o igual a 20.',
        });
        btnAgregarVenta.disabled = true; // Desactivar el botón
        return;
    }

    // Agregar fila a la tabla
    let tbody = document.getElementById('tbodyTicket');
    let nuevaFila = tbody.insertRow();
    let cellNum = nuevaFila.insertCell(0);
    let cellNombre = nuevaFila.insertCell(1);
    let cellTipoVenta = nuevaFila.insertCell(2);
    let cellCantidad = nuevaFila.insertCell(3);
    let cellFecha = nuevaFila.insertCell(4);
    let cellSubtotal = nuevaFila.insertCell(5);
    let cellEliminar = nuevaFila.insertCell(6);

    cellNum.textContent = contador++;
    cellNombre.textContent = nombreGalleta;
    cellTipoVenta.textContent = tipoVenta;
    cellCantidad.textContent = cantidad + " Gramos\n," + CantidadGalletas + " Galletas";
    cellFecha.textContent = fecha;
    cellSubtotal.textContent = subtotal.toFixed(2);

    // Crear botón de eliminar
    let botonEliminar = document.createElement("button");
    botonEliminar.classList.add("button");
    botonEliminar.innerHTML = "&#128465;";

    // Agregar evento click al botón eliminar
    botonEliminar.addEventListener("click", function() {
        eliminarFilaPieza(nuevaFila);
    });

    // Agregar el botón al cellEliminar
    cellEliminar.appendChild(botonEliminar);

    // Recalcular el total después de agregar cada fila
    agregarFilaTotal();
}

//function calcularTotalDinero() {
//    // Obtener los elementos del DOM
//    let precioElementText = document.getElementById('txtPrecio').textContent;
//    let cantidadDineroElement = document.getElementById('txtCantidadDinero');
//    let totalElement = document.getElementById('txtTotalDinero');
//    let cantidadGalletasElement = document.getElementById('txtCantidadGalletasDinero');
//    let btnAgregarVenta = document.getElementById('btnAgregarVentaDinero');
//
//    // Convertir el valor del precio a un número
//    let precio = parseFloat(precioElementText) || 0;
//    // Convertir la cantidad en dinero a un número
//    let cantidadDinero = parseFloat(cantidadDineroElement.value) || 0;
//
//    // Mostrar alerta si el tipo de galleta no está seleccionado
//    if (precioElementText === '') {
//        Swal.fire({
//            icon: 'warning',
//            title: 'Advertencia',
//            text: 'Seleccione un tipo de Galleta.',
//        });
//        btnAgregarVenta.disabled = true; // Desactivar el botón
//        return;
//    }
//
//    // Mostrar alerta si la cantidad en dinero no es válida
//    if (cantidadDinero < precio) {
//        Swal.fire({
//            icon: 'warning',
//            title: 'Advertencia',
//            text: `La cantidad en dinero no es válida. Debe ser al menos ${precio} pesos.`,
//        });
//        btnAgregarVenta.disabled = true; // Desactivar el botón
//        return;
//    }
//
//    // Calcular la cantidad de galletas
//    const cantidadGalletas = Math.floor(cantidadDinero / precio);
//
//    // Calcular el total a cobrar
//    const totalDinero = cantidadGalletas * precio;
//
//    // Actualizar el contenido del label con la cantidad de galletas y el total en pesos
//    cantidadGalletasElement.textContent = cantidadGalletas;
//    totalElement.textContent = totalDinero.toFixed(2); // Redondear a dos decimales
//
//    // Activar el botón de agregar
//    btnAgregarVenta.disabled = false;
//
//    return totalDinero.toFixed(2);
//}

function calcularTotalDinero() {
    // Obtener los elementos del DOM
    let precioElementText = document.getElementById('txtPrecio').textContent;
    let cantidadDineroElement = document.getElementById('txtCantidadDinero');
    let totalElement = document.getElementById('txtTotalDinero');
    let cantidadGalletasElement = document.getElementById('txtCantidadGalletasDinero');
    let btnAgregarVenta = document.getElementById('btnAgregarVentaDinero');

    // Convertir el valor del precio a un número
    let precio = parseFloat(precioElementText) || 0;
    // Convertir la cantidad en dinero a un número
    let cantidadDinero = parseFloat(cantidadDineroElement.value) || 0;

    // Mostrar alerta si el tipo de galleta no está seleccionado
    if (precioElementText === '') {
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: 'Seleccione un tipo de Galleta.',
        });
        btnAgregarVenta.disabled = true; // Desactivar el botón
        return;
    }

    // Mostrar alerta si la cantidad en dinero no es válida
    if (cantidadDinero.length > 2 && parseFloat(cantidadDinero) < precio) {
    Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: `La cantidad en dinero no es válida. Debe ser al menos ${precio} pesos.`,
    });
    btnAgregarVenta.disabled = true; // Desactivar el botón
    return;
}


    // Calcular la cantidad de galletas redondeando hacia arriba solo si es más de la mitad del precio
    let cantidadGalletas; // Declara una variable para almacenar la cantidad de galletas.

    // Usa Math.ceil si cantidadDinero es mayor o igual al punto de referencia, de lo contrario, usa Math.floor.
    cantidadGalletas = cantidadDinero >= (precio / 2) + precio ? Math.ceil(cantidadDinero / precio) : Math.floor(cantidadDinero / precio);

    // Asignar el valor de cantidadDinero a totalDinero
    let totalDinero = cantidadDinero;

    // Actualizar el contenido del label con la cantidad de galletas y el total en pesos
    cantidadGalletasElement.textContent = cantidadGalletas;
    totalElement.textContent = totalDinero.toFixed(2); // Redondear a dos decimales

    // Activar el botón de agregar
    btnAgregarVenta.disabled = false;

    return totalDinero.toFixed(2);
}

function validarCantidadDinero() {
    let cantidadInput = document.getElementById('txtCantidadDinero');
    let totalLabel = document.getElementById('txtTotalDinero');
    let btnAgregarVenta = document.getElementById('btnAgregarVentaDinero');

    cantidadInput.value = cantidadInput.value.replace(/[^0-9.]/g, ''); // Eliminar caracteres no numéricos

    // Habilitar o deshabilitar el botón de agregar según si el campo de total tiene datos
    btnAgregarVenta.disabled = isNaN(parseFloat(totalLabel.textContent.trim()));
    calcularTotalDinero();
}
function presionarTeclaDinero(event) {
    // Verificar si la tecla presionada es 'Enter' (código 13)
    if (event.keyCode === 13) {
        event.preventDefault(); // Evitar el comportamiento por defecto del 'Enter' en un formulario
        calcularTotalDinero();
    }
}
function agregarFilaDinero() {
    let nombreGalleta = document.getElementById('txtNombreNombre').innerText;
    let tipoVenta = obtenerTipoVenta();
    let cantidadDinero = parseFloat(document.getElementById('txtCantidadDinero').value);
    let precio = parseFloat(document.getElementById('txtPrecio').innerText);
    let fecha = obtenerFecha();

    // Calcular la cantidad de galletas
    let cantidadGalletas = cantidadDinero >= (precio / 2) + precio
        ? Math.ceil(cantidadDinero / precio)
        : Math.floor(cantidadDinero / precio);

    // Calcular el subtotal
    let subtotal = cantidadDinero;

    let btnAgregarVenta = document.getElementById('btnAgregarVentaDinero');

    // Verificar si la cantidad es un número válido
    if (isNaN(cantidadDinero) || cantidadDinero === '') {
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: `Ingrese una cantidad de dinero válida (mayor o igual a ${precio} ).`,
        });
        btnAgregarVenta.disabled = true; // Desactivar el botón
        return;
    }

    // Verificar si la cantidad es menor que 20 o el subtotal es 0.00
    if (cantidadDinero < precio || subtotal <= 0.00) {
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: `La cantidad en dinero no es válida. Ingrese un número mayor o igual a ${precio}.`,
        });
        btnAgregarVenta.disabled = true; // Desactivar el botón
        return;
    }

    // Agregar fila a la tabla
    let tbody = document.getElementById('tbodyTicket');
    let nuevaFila = tbody.insertRow();
    let cellNum = nuevaFila.insertCell(0);
    let cellNombre = nuevaFila.insertCell(1);
    let cellTipoVenta = nuevaFila.insertCell(2);
    let cellCantidad = nuevaFila.insertCell(3);
    let cellFecha = nuevaFila.insertCell(4);
    let cellSubtotal = nuevaFila.insertCell(5);
    let cellEliminar = nuevaFila.insertCell(6);

    cellNum.textContent = contador++;
    cellNombre.textContent = nombreGalleta;
    cellTipoVenta.textContent = tipoVenta;
    cellCantidad.textContent = `${cantidadDinero} Pesos, ${cantidadGalletas} Galletas`;
    cellFecha.textContent = fecha;
    cellSubtotal.textContent = subtotal.toFixed(2);

    // Crear botón de eliminar
    let botonEliminar = document.createElement("button");
    botonEliminar.classList.add("button");
    botonEliminar.innerHTML = "&#128465;";

    // Agregar evento click al botón eliminar
    botonEliminar.addEventListener("click", function() {
        eliminarFilaPieza(nuevaFila);
    });

    // Agregar el botón al cellEliminar
    cellEliminar.appendChild(botonEliminar);

    // Recalcular el total después de agregar cada fila
    agregarFilaTotal();
}

function calcularTotalCaja() {
    // Obtener los elementos del DOM
    let precioElementText = document.getElementById('txtPrecio').textContent;
    let totalElement = document.getElementById('txtTotalCaja');
    let cantidadGalletasElement = document.getElementById('txtCantidadGalletasCaja');

    // Convertir el valor del precio a un número
    let precio = parseFloat(precioElementText) || 0;

    // Mostrar alerta si el tipo de galleta no está seleccionado
    if (precioElementText === '') {
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: 'Seleccione un tipo de Galleta.',
        });
        return;
    }

    // Obtener el tipo de caja seleccionado
    let tipoCaja = obtenerTipoCaja();

    // Calcular la cantidad de galletas según el tipo de caja
    let cantidadGalletas; // Declara una variable para almacenar la cantidad de galletas.

    if (tipoCaja === 'Medio Kilo') {
        cantidadGalletas = 25; // Cantidad de galletas en la caja de medio kilo
    } else if (tipoCaja === 'Kilo') {
        cantidadGalletas = 50; // Cantidad de galletas en la caja de un kilo
    } else {
        // Tipo de caja no seleccionado
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: 'Seleccione un tipo de caja (medio kilo o kilo).',
        });
        return;
    }

    // Calcular el total en pesos
    let totalDinero = cantidadGalletas * precio;

    // Actualizar el contenido del label con la cantidad de galletas y el total en pesos
    cantidadGalletasElement.textContent = cantidadGalletas;
    totalElement.textContent = totalDinero.toFixed(2); // Redondear a dos decimales

}

// Función para obtener el tipo de caja seleccionado
function obtenerTipoCaja() {
    let medioKiloRadio = document.getElementById('medioKilo');
    if (medioKiloRadio.checked) {
        return 'Medio Kilo';
    }

    let kiloRadio = document.getElementById('kilo');
    if (kiloRadio.checked) {
        return 'Kilo';
    }

    return ''; // Ninguna opción de caja seleccionada
}

function agregarFilaCaja() {
    let nombreGalleta = document.getElementById('txtNombreNombre').innerText;
    let tipoVenta = obtenerTipoVenta();
    let tipoCaja = obtenerTipoCaja(); 
    let precio = parseFloat(document.getElementById('txtPrecio').innerText);
    let fecha = obtenerFecha();
    let cantidadGalletas = document.getElementById('txtCantidadGalletasCaja').innerText;
    let total = parseFloat(document.getElementById('txtTotalCaja').innerText);
    let subtotal = cantidadGalletas * precio;

    // Desactivar el botón si no se ha seleccionado el tipo de caja
    if (tipoCaja === '') {
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: 'Seleccione un tipo de caja (medio kilo o kilo)',
        });
        return;
    }

    // Desactivar el botón si el nombre, el precio, la cantidad de galletas o el total están vacíos
    if (!nombreGalleta || isNaN(precio) || !cantidadGalletas || isNaN(total)) {
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: 'Complete todos los campos antes de agregar la venta.',
        });
        return;
    }

    // Agregar fila a la tabla
    let tbody = document.getElementById('tbodyTicket');
    let nuevaFila = tbody.insertRow();
    let cellNum = nuevaFila.insertCell(0);
    let cellNombre = nuevaFila.insertCell(1);
    let cellTipoVenta = nuevaFila.insertCell(2);
    let cellCantidad = nuevaFila.insertCell(3);
    let cellFecha = nuevaFila.insertCell(4);
    let cellSubtotal = nuevaFila.insertCell(5);
    let cellEliminar = nuevaFila.insertCell(6);

    cellNum.textContent = contador++;
    cellNombre.textContent = nombreGalleta;
    cellTipoVenta.textContent = tipoVenta;
    cellCantidad.textContent = ` 1 caja de ${tipoCaja}, ${cantidadGalletas} Galletas`;
    cellFecha.textContent = fecha;
    cellSubtotal.textContent = subtotal.toFixed(2);

    // Crear botón de eliminar
    let botonEliminar = document.createElement("button");
    botonEliminar.classList.add("button");
    botonEliminar.innerHTML = "&#128465;";

    // Agregar evento click al botón eliminar
    botonEliminar.addEventListener("click", function() {
        eliminarFilaPieza(nuevaFila);
    });

    // Agregar el botón al cellEliminar
    cellEliminar.appendChild(botonEliminar);

    // Recalcular el total después de agregar cada fila
    agregarFilaTotal();
}
