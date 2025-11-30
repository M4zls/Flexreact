// Simulador de estados de pedidos
export const simularCambioEstado = (pedidoId, actualizarEstadoPedido) => {
    const estados = ['Procesando', 'Enviado', 'Entregado'];
    let estadoActual = 0;
    
    const intervalo = setInterval(() => {
        if (estadoActual < estados.length - 1) {
            estadoActual++;
            actualizarEstadoPedido(pedidoId, estados[estadoActual]);
        } else {
            clearInterval(intervalo);
        }
    }, 30000); // Cambia estado cada 30 segundos para demostración
    
    return intervalo;
};

// Función para generar estados aleatorios en pedidos existentes
export const actualizarEstadosAleatorios = (pedidos, actualizarEstadoPedido) => {
    const estados = ['Procesando', 'Enviado', 'Entregado'];
    
    pedidos.forEach(pedido => {
        if (pedido.estado === 'Procesando') {
            // 30% probabilidad de cambiar a Enviado
            if (Math.random() < 0.3) {
                setTimeout(() => {
                    actualizarEstadoPedido(pedido.id, 'Enviado');
                    
                    // 50% probabilidad de cambiar a Entregado después de 1 minuto
                    if (Math.random() < 0.5) {
                        setTimeout(() => {
                            actualizarEstadoPedido(pedido.id, 'Entregado');
                        }, 60000);
                    }
                }, Math.random() * 20000); // Entre 0 y 20 segundos
            }
        } else if (pedido.estado === 'Enviado') {
            // 60% probabilidad de cambiar a Entregado
            if (Math.random() < 0.6) {
                setTimeout(() => {
                    actualizarEstadoPedido(pedido.id, 'Entregado');
                }, Math.random() * 30000); // Entre 0 y 30 segundos
            }
        }
    });
};