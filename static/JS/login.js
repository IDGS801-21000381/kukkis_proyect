
        function iniciarSesion() {
            Swal.fire({
                icon: 'success',
                title: 'Bienvenido',
                text: 'Sesión iniciada correctamente.'
            }).then(() => {
                // Redireccionar a la página de administración
                 window.location.replace('/Don_Galleto/admin/index.html');
            });

            // Guardar la información de inicio de sesión en variables locales
            localStorage.setItem('sesionIniciada', 'true');
            localStorage.setItem('usuario', 'galleto');

            // Ocultar botón de inicio de sesión y mostrar botón de cierre de sesión
            document.getElementById('btnIngresar').style.display = 'none';
            document.getElementById('btnCerrarSesion').style.display = 'block';
        }

        function cerrarSesion() {           
            Swal.fire({
                icon: 'info',
                title: 'Sesión cerrada',
                text: 'Sesión cerrada correctamente.'
            }).then(() => {
                // Redireccionar a la página principal
                window.location.href = '/base';
            });
        }
        
        function descargarPDF() {
    window.open('/static/img/ManualDeUsuario.pdf', '_blank');
}


    
