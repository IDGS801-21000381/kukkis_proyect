/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
 */

function cargarModuloReporteGanancias()
{
    fetch('/admin/reporteGanancias/reporteGanancias.html')
            .then(respuesta => {
                return respuesta.text();
            })
            .then(datos => {
                document.getElementById('contenedor_principal').innerHTML = datos;
            });
}

function cargarContenidoReporte(categoria) {
    let ruta;
    switch (categoria) {
        case 'dia':
            ruta = '/admin/reporteGanancias/dia.html';
            break;
        case 'semana':
            ruta = '/admin/reporteGanancias/semana.html';
            break;
        case 'mes':
            ruta = '/admin/reporteGanancias/mes.html';
            break;
        case 'año':
            ruta = '/admin/reporteGanancias/año.html';
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
            document.getElementById('contenedor_Reporte').innerHTML = datos;
        })
        .catch(error => {
            console.error('Error al cargar el archivo:', error);
        });
}
