// Precios de productos
const precios = {
    "frijol": 8000,
    "arroz": 4500,
    "aceite": 12000,
    "sal": 2500,
    "azucar": 5000,
    "cafe": 10000,
    "papa": 3000,
    "cebolla": 4000,
    "tomate": 5000,
    "carne": 25000,
    "pollo": 18000,
    "cerveza": 20000,
    "gaseosa": 8000,
    "pan": 500,
    "huevos": 15000,
    "queso": 12000
};

// Nombres completos de productos
const nombresProductos = {
    "frijol": "Frijol (1kg)",
    "arroz": "Arroz (1kg)",
    "aceite": "Aceite (1L)",
    "sal": "Sal (500g)",
    "azucar": "Azúcar (1kg)",
    "cafe": "Café (500g)",
    "papa": "Papa (1kg)",
    "cebolla": "Cebolla (1kg)",
    "tomate": "Tomate (1kg)",
    "carne": "Carne (1kg)",
    "pollo": "Pollo (1kg)",
    "cerveza": "Cerveza (6 unidades)",
    "gaseosa": "Gaseosa (2.5L)",
    "pan": "Pan (unidad)",
    "huevos": "Huevos (30 unidades)",
    "queso": "Queso (500g)"
};

// Array para guardar los productos del pedido
let pedido = [];
let total = 0;

// Función para cambiar cantidad
function cambiarCantidad(cambio) {
    const input = document.getElementById('cantidad');
    let valor = parseInt(input.value) || 1;
    valor += cambio;
    if (valor < 1) valor = 1;
    input.value = valor;
}

// Función para agregar producto al pedido
function agregarProducto() {
    const select = document.getElementById('selectProducto');
    const productoId = select.value;
    const cantidad = parseInt(document.getElementById('cantidad').value) || 1;
    
    if (!productoId) {
        alert('Por favor selecciona un producto');
        return;
    }
    
    // Buscar si el producto ya está en el pedido
    const productoExistente = pedido.find(item => item.id === productoId);
    
    if (productoExistente) {
        productoExistente.cantidad += cantidad;
        productoExistente.subtotal = productoExistente.cantidad * productoExistente.precioUnitario;
    } else {
        pedido.push({
            id: productoId,
            nombre: nombresProductos[productoId],
            cantidad: cantidad,
            precioUnitario: precios[productoId],
            subtotal: cantidad * precios[productoId]
        });
    }
    
    // Actualizar la tabla
    actualizarTabla();
    
    // Resetear selector
    select.value = '';
    document.getElementById('cantidad').value = 1;
    
    // Mostrar notificación
    mostrarNotificacion(`¡${nombresProductos[productoId]} agregado!`);
}

// Función para actualizar la tabla del pedido
function actualizarTabla() {
    const cuerpoTabla = document.getElementById('cuerpoTabla');
    const filaVacia = document.getElementById('filaVacia');
    const totalWhatsApp = document.getElementById('totalWhatsApp');
    
    // Limpiar tabla
    cuerpoTabla.innerHTML = '';
    
    if (pedido.length === 0) {
        // Mostrar fila vacía
        cuerpoTabla.appendChild(filaVacia);
        total = 0;
    } else {
        // Ocultar fila vacía
        filaVacia.style.display = 'none';
        
        // Calcular total
        total = pedido.reduce((sum, producto) => sum + producto.subtotal, 0);
        
        // Agregar cada producto a la tabla
        pedido.forEach((producto, index) => {
            const fila = document.createElement('tr');
            
            fila.innerHTML = `
                <td>${producto.nombre}</td>
                <td>${producto.cantidad}</td>
                <td>$${producto.precioUnitario.toLocaleString()}</td>
                <td>$${producto.subtotal.toLocaleString()}</td>
                <td>
                    <button class="btn-eliminar" onclick="eliminarProducto(${index})">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </td>
            `;
            
            cuerpoTabla.appendChild(fila);
        });
        
        // Actualizar totales
        document.getElementById('totalPagar').textContent = total.toLocaleString();
        totalWhatsApp.textContent = total.toLocaleString();
    }
}

// Función para eliminar producto
function eliminarProducto(index) {
    pedido.splice(index, 1);
    actualizarTabla();
    mostrarNotificacion('Producto eliminado del pedido');
}

// Función para enviar pedido por WhatsApp
function enviarPedidoWhatsApp() {
    if (pedido.length === 0) {
        alert('Agrega al menos un producto a tu pedido');
        return;
    }
    
    const nombre = document.getElementById('nombreCliente').value.trim();
    const telefono = document.getElementById('telefonoCliente').value.trim();
    
    if (!nombre || !telefono) {
        alert('Por favor ingresa tu nombre y teléfono');
        return;
    }
    
    const direccion = document.getElementById('direccionCliente').value.trim() || 'Sin dirección especificada';
    const notas = document.getElementById('notasCliente').value.trim() || 'Sin notas adicionales';
    
    // Construir mensaje para WhatsApp
    let mensaje = `*NUEVO PEDIDO - TIENDA CLICK*%0A%0A`;
    mensaje += `*Cliente:* ${nombre}%0A`;
    mensaje += `*Teléfono:* ${telefono}%0A`;
    mensaje += `*Dirección:* ${direccion}%0A`;
    mensaje += `*Notas:* ${notas}%0A%0A`;
    mensaje += `*--- PRODUCTOS ---*%0A`;
    
    pedido.forEach((producto, index) => {
        mensaje += `${index + 1}. ${producto.nombre}%0A`;
        mensaje += `   Cantidad: ${producto.cantidad}%0A`;
        mensaje += `   Precio: $${producto.precioUnitario.toLocaleString()}%0A`;
        mensaje += `   Subtotal: $${producto.subtotal.toLocaleString()}%0A%0A`;
    });
    
    mensaje += `*TOTAL A PAGAR: $${total.toLocaleString()}*%0A%0A`;
    mensaje += `*¡Gracias por tu pedido!*%0A`;
    mensaje += `Te contactaremos pronto para confirmar.`;
    
    // Número de WhatsApp
    const numeroWhatsApp = '573134971077';
    
    // Abrir WhatsApp
    window.open(`https://wa.me/${numeroWhatsApp}?text=${mensaje}`, '_blank');
    
    // Opcional: Mostrar confirmación
    mostrarNotificacion('¡Pedido enviado por WhatsApp!', 'success');
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = 'info') {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion';
    notificacion.textContent = mensaje;
    
    // Estilos
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${tipo === 'success' ? '#27ae60' : '#4a6491'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-weight: bold;
        max-width: 350px;
    `;
    
    document.body.appendChild(notificacion);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notificacion.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notificacion.parentNode) {
                document.body.removeChild(notificacion);
            }
        }, 300);
    }, 3000);
}

// Agregar animaciones CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Inicializar tabla
actualizarTabla();

// Validar campos en tiempo real
document.getElementById('nombreCliente').addEventListener('input', function() {
    this.style.borderColor = this.value.trim() ? '#27ae60' : '#ddd';
});

document.getElementById('telefonoCliente').addEventListener('input', function() {
    this.style.borderColor = this.value.trim() ? '#27ae60' : '#ddd';
});

// Mostrar mensaje de bienvenida
window.onload = function() {
    console.log('Tienda Click - Sistema de pedidos cargado');
};